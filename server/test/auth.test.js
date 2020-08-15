const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const reloadDB = require("../databaseData/reloadDB");

chai.use(chaiHttp);
const { expect, request } = chai;

function checkUserHasOnlyExpectedProperties(user, expectedUser) {
  if (!expectedUser) {
    expect(user).to.have.ownProperty("name");
    expect(user).to.have.ownProperty("email");
  } else {
    const { name, email } = expectedUser;
    expect(user).to.have.ownProperty("name", name);
    expect(user).to.have.ownProperty("email", email);
  }
  expect(user).to.have.ownProperty("id");
  expect(Object.keys(user)).to.have.lengthOf(3);
}

describe("Testing /api/auth/", function () {
  after(function () {
    app.disconnect();
    reloadDB();
  });
  describe("#login", function () {
    it("Should reject wrong credentials", async function () {
      const user = { email: "darth@vader.com", password: "asdasdasd" };
      const res = await request(app).post("/api/auth/login").send(user);
      expect(res).to.have.status(401);
    });
    it("Should login user with correct credentials", async function () {
      const userLogin = { email: "darth@vader.com", password: "darth123" };
      const res = await request(app).post("/api/auth/login").send(userLogin);
      const {
        body: { isAuthenticated, user },
      } = res;
      expect(res).to.have.status(200);
      expect(isAuthenticated).to.be.true;
      checkUserHasOnlyExpectedProperties(user);
    });
    it("Should login user, then not login user again", async function () {
      const agent = request.agent(app);
      try {
        const userLogin = { email: "darth@vader.com", password: "darth123" };
        const res = await agent.post("/api/auth/login").send(userLogin);
        expect(res).to.have.status(200);
        const res2 = await agent.post("/api/auth/login").send(userLogin);
        expect(res2).to.have.status(401);
        agent.close();
      } catch (err) {
        agent.close();
        throw err;
      }
    });
    it("Should login, then not call register", async function () {
      const agent = request.agent(app);
      try {
        const userLogin = { email: "darth@vader.com", password: "darth123" };
        const res = await agent.post("/api/auth/login").send(userLogin);
        expect(res).to.have.status(200);
        const res2 = await agent.post("/api/auth/register").send(userLogin);
        expect(res2).to.have.status(401);
        agent.close();
      } catch (err) {
        agent.close();
        throw err;
      }
    });
  });
  describe("#register", function () {
    it("Should register user", async function () {
      const newUser = {
        name: "Darth Sidious",
        email: "darth@Sidious",
        password: "darth123",
      };
      const res = await request(app).post("/api/auth/register").send(newUser);
      expect(res).to.have.status(200);
      const {
        body: { isAuthenticated, user },
      } = res;
      expect(isAuthenticated).to.be.true;
      const expectedUser = { name: newUser.name, email: newUser.email };
      checkUserHasOnlyExpectedProperties(user, expectedUser);
    });
    it("Should register, then not register same user", async function () {
      const newUser = {
        name: "Darth Maul",
        email: "darth@maul",
        password: "darth123",
      };
      const res = await request(app).post("/api/auth/register").send(newUser);
      expect(res).to.have.status(200);
      const res2 = await request(app).post("/api/auth/register").send(newUser);
      expect(res2).to.have.status(401);
    });
    it("Should register, then reject login", async function () {
      const agent = request.agent(app);
      try {
        const newUser = {
          name: "Darth Tyranus",
          email: "darth@tyranus",
          password: "darth123",
        };
        const loginUser = { email: newUser.email, password: newUser.password };
        const res = await agent.post("/api/auth/register").send(newUser);
        expect(res).to.have.status(200);
        const res2 = await agent.post("/api/auth/login").send(loginUser);
        expect(res2).to.have.status(401);
        agent.close();
      } catch (err) {
        agent.close();
        throw err;
      }
    });
  });
  describe("#checkAuth", function () {
    it("Should reject not logged in user", async function () {
      const res = await request(app).get("/api/auth/checkAuth");
      expect(res).to.have.status(401);
    });
    it("Should login user, then fetch user info", async function () {
      const agent = request.agent(app);
      try {
        const userLogin = { email: "darth@vader.com", password: "darth123" };
        const res = await agent.post("/api/auth/login").send(userLogin);
        expect(res).to.have.status(200);
        const res2 = await agent.get("/api/auth/checkAuth");
        expect(res2).to.have.status(200);
        const {
          body: { isAuthenticated, user },
        } = res;
        expect(isAuthenticated).to.be.true;
        checkUserHasOnlyExpectedProperties(user);
        agent.close();
      } catch (err) {
        agent.close();
        throw err;
      }
    });
    it("Should register user, then fetch user info", async function () {
      const agent = request.agent(app);
      try {
        const newUser = {
          name: "Sheev Palpatine",
          email: "sheev@palpatine.com",
          password: "sheev123",
        };
        const res = await agent.post("/api/auth/register").send(newUser);
        expect(res).to.have.status(200);
        const res2 = await agent.get("/api/auth/checkAuth");
        expect(res2).to.have.status(200);
        const {
          body: { isAuthenticated, user },
        } = res;
        expect(isAuthenticated).to.be.true;
        const expectedUser = { name: newUser.name, email: newUser.email };
        checkUserHasOnlyExpectedProperties(user, expectedUser);
        agent.close();
      } catch (err) {
        agent.close();
        throw err;
      }
    });
    it("Should login, then logout, then reject user info", async function () {
      const agent = request.agent(app);
      try {
        const userLogin = { email: "darth@vader.com", password: "darth123" };
        const res = await agent.post("/api/auth/login").send(userLogin);
        expect(res).to.have.status(200);
        const res2 = await agent.get("/api/auth/logout");
        expect(res2).to.have.status(200);
        const res3 = await agent.get("/api/auth/checkAuth");
        expect(res3).to.have.status(401);
        agent.close();
      } catch (err) {
        agent.close();
        throw err;
      }
    });
  });
  describe("#logout", function () {
    it("Should reject logout request of unauthenticated user", async function () {
      const res = await request(app).get("/api/auth/logout");
      expect(res).to.have.status(401);
    });
    it("Should login and logout successfully", async function () {
      const agent = request.agent(app);
      try {
        const userLogin = { email: "darth@vader.com", password: "darth123" };
        const res = await agent.post("/api/auth/login").send(userLogin);
        expect(res).to.have.status(200);
        const res2 = await agent.get("/api/auth/logout");
        expect(res2).to.have.status(200);
        agent.close();
      } catch (err) {
        agent.close();
        throw err;
      }
    });
    it("Should register and logout successfully", async function () {
      const agent = request.agent(app);
      try {
        const newUser = {
          name: "Mace Windu",
          email: "mace@windu.com",
          password: "mace123",
        };
        const res = await agent.post("/api/auth/register").send(newUser);
        expect(res).to.have.status(200);
        const res2 = await agent.get("/api/auth/logout");
        expect(res2).to.have.status(200);
        agent.close();
      } catch (err) {
        agent.close();
        throw err;
      }
    });
    it("Should login, logout and then reject logout", async function () {
      const agent = request.agent(app);
      try {
        const userLogin = { email: "darth@vader.com", password: "darth123" };
        const res = await agent.post("/api/auth/login").send(userLogin);
        expect(res).to.have.status(200);
        const res2 = await agent.get("/api/auth/logout");
        expect(res2).to.have.status(200);
        const res3 = await agent.get("/api/auth/logout");
        expect(res3).to.have.status(401);
        agent.close();
      } catch (err) {
        agent.close();
        throw err;
      }
    });
  });
  describe("#deleteUser", function () {
    it("Should reject request from not logged in user", async function () {
      const res = await request(app).get("/api/auth/deleteUser");
      expect(res).to.have.status(401);
    });
    it("Should login, delete logged in user, not login again, and register", async function () {
      const agent = request.agent(app);
      try {
        const userLogin = { email: "darth@vader.com", password: "darth123" };
        const res = await agent.post("/api/auth/login").send(userLogin);
        expect(res).to.have.status(200);
        const res2 = await agent.get("/api/auth/deleteUser");
        expect(res2).to.have.status(200);
        const res3 = await agent.post("/api/auth/login").send(userLogin);
        expect(res3).to.have.status(401);
        const newUser = {
          name: "Darth Vader",
          email: userLogin.email,
          password: userLogin.password,
        };
        const res4 = await agent.post("/api/auth/register").send(newUser);
        expect(res4).to.have.status(200);
        agent.close();
      } catch (err) {
        agent.close();
        throw err;
      }
    });
    it("Should register, logout, login, delete, not login again, and then register again", async function () {
      const agent = request.agent(app);
      try {
        const newUser = {
          name: "Boba Fett",
          email: "boba@fett.com",
          password: "boba123",
        };
        const userLogin = {
          email: newUser.email,
          password: newUser.password,
        };
        const res = await agent.post("/api/auth/register").send(newUser);
        expect(res).to.have.status(200);
        const res2 = await agent.get("/api/auth/logout");
        expect(res2).to.have.status(200);
        const res3 = await agent.post("/api/auth/login").send(userLogin);
        expect(res3).to.have.status(200);
        const res4 = await agent.get("/api/auth/deleteUser");
        expect(res4).to.have.status(200);
        const res5 = await agent.post("/api/auth/login").send(userLogin);
        expect(res5).to.have.status(401);
        const res6 = await agent.post("/api/auth/register").send(newUser);
        expect(res6).to.have.status(200);
        agent.close();
      } catch (err) {
        agent.close();
        throw err;
      }
    });
  });
});
