import React from "react";
import PropTypes from "prop-types";
import axios from "axios";

const Header = ({ authenticated, user, handleAuthChange }) => {
  const handleLogout = async () => {
    try {
      await axios.get("/api/auth/logout");
      const authenticated = false;
      const user = null;
      handleAuthChange(authenticated, user);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      {authenticated ? (
        <>
          <h1>Welcome {user.name}</h1>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <h1>Hello, please login or register</h1>
        </>
      )}
    </div>
  );
};

Header.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }),
  handleAuthChange: PropTypes.func.isRequired,
};

export default Header;
