import React from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import LoginRegister from "./components/LoginRegister";
import Header from "./components/Header";

axios.defaults.withCredentials = true;

class App extends React.Component {
  state = {
    user: null,
    authenticated: false,
    isLoading: true,
  };

  async componentDidMount() {
    try {
      const res = await axios.get("/api/auth/checkAuth");
      const { authenticated, user } = res.data;
      this.setState({ authenticated, user });
    } catch (err) {
      this.setState({ authenticated: false, user: null });
    }
    this.setState({ isLoading: false });
  }

  handleAuthChange = (authenticated, user) => {
    this.setState({ authenticated, user });
  };

  render() {
    const { authenticated, user, isLoading } = this.state;
    return (
      <Router>
        <Header
          authenticated={authenticated}
          user={user}
          handleAuthChange={this.handleAuthChange}
        />
        {isLoading ? (
          <h1>Loading... </h1>
        ) : (
          <Switch>
            <Route exact path="/">
              {authenticated ? (
                <Dashboard user={user} />
              ) : (
                <Redirect to="/login" />
              )}
            </Route>
            <Route exact path="/login">
              {!authenticated ? (
                <LoginRegister handleAuthChange={this.handleAuthChange} />
              ) : (
                <Redirect to="/" />
              )}
            </Route>
          </Switch>
        )}
      </Router>
    );
  }
}

export default App;
