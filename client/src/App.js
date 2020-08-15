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

axios.defaults.withCredentials = true;

class App extends React.Component {
  state = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
  };

  async componentDidMount() {
    try {
      const res = await axios.get("/api/auth/checkAuth");
      const { isAuthenticated, user } = res.data;
      this.setState({ isAuthenticated, user });
    } catch (err) {
      this.setState({ isAuthenticated: false, user: null });
    }
    this.setState({ isLoading: false });
  }

  handleAuthChange = (isAuthenticated, user) => {
    this.setState({ isAuthenticated, user });
  };

  render() {
    const { isAuthenticated, user, isLoading } = this.state;
    return (
      <Router>
        {isLoading ? (
          <h1>Loading... </h1>
        ) : (
          <Switch>
            <Route exact path="/">
              {isAuthenticated ? (
                <Dashboard
                  user={user}
                  handleAuthChange={this.handleAuthChange}
                />
              ) : (
                <Redirect to="/login" />
              )}
            </Route>
            <Route exact path="/login">
              {!isAuthenticated ? (
                <LoginRegister handleAuthChange={this.handleAuthChange} />
              ) : (
                <Redirect to="/" />
              )}
            </Route>
            <Route exact path="/404">
              <h1>Page not found 404 error</h1>
            </Route>
            <Redirect to="/404" />
          </Switch>
        )}
      </Router>
    );
  }
}

export default App;
