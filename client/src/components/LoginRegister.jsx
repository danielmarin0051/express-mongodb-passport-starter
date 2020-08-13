import React from "react";
import PropTypes from "prop-types";
import axios from "axios";

const Login = ({ toggleLogin, login, handleChange }) => {
  return (
    <>
      <h1>Login</h1>
      <form>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            required
            autoComplete={"on"}
            onChange={handleChange("email")}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            required
            autoComplete={"on"}
            onChange={handleChange("password")}
          />
        </div>
        <div>
          <button onClick={login}>Login</button>
        </div>
        <button onClick={toggleLogin}>Or register</button>
      </form>
    </>
  );
};

const Register = ({ toggleLogin, register, handleChange }) => {
  return (
    <>
      <h1>Register</h1>
      <form>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            required
            autoComplete={"on"}
            onChange={handleChange("name")}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            required
            autoComplete={"on"}
            onChange={handleChange("email")}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            required
            autoComplete={"on"}
            onChange={handleChange("password")}
          />
        </div>
        <div>
          <button onClick={register}>Register</button>
        </div>
        <button onClick={toggleLogin}>Or login</button>
      </form>
    </>
  );
};

class LoginRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false,
      name: "",
      email: "",
      password: "",
    };
  }

  toggleLogin = () => {
    this.setState({ isLogin: !this.state.isLogin });
  };

  login = async (event) => {
    event.preventDefault();
    try {
      const { email, password } = this.state;
      const newUser = { email, password };
      console.log("Client: attempting to login with user: ", newUser);
      const res = await axios.post("/api/auth/login", newUser);
      const { authenticated, user } = res.data;
      this.props.handleAuthChange(authenticated, user);
      console.log("login response: ", res);
    } catch (err) {
      console.log("Error while logging in", err);
    }
  };

  register = async (event) => {
    event.preventDefault();
    try {
      const { name, email, password } = this.state;
      const newUser = { name, email, password };
      console.log("Client: attempting to register user: ", newUser);
      const res = await axios.post("/api/auth/register", newUser);
      const { authenticated, user } = res.data;
      this.props.handleAuthChange(authenticated, user);
      console.log("register response: ", res);
    } catch (err) {
      console.log("Error while registering", err);
    }
  };

  handleChange = (prop) => (event) => {
    this.setState({ [prop]: event.target.value });
  };

  render() {
    const { isLogin } = this.state;
    return (
      <div>
        {isLogin ? (
          <Login
            toggleLogin={this.toggleLogin}
            login={this.login}
            handleChange={this.handleChange}
          />
        ) : (
          <Register
            toggleLogin={this.toggleLogin}
            register={this.register}
            handleChange={this.handleChange}
          />
        )}
      </div>
    );
  }
}

LoginRegister.propTypes = {
  handleAuthChange: PropTypes.func.isRequired,
};

export default LoginRegister;
