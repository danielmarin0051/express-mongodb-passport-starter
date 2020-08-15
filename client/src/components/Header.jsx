import React from "react";
import PropTypes from "prop-types";
import axios from "axios";

const Header = ({ user, handleAuthChange }) => {
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
      <h1>Welcome {user.name}</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

Header.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }),
  handleAuthChange: PropTypes.func.isRequired,
};

export default Header;
