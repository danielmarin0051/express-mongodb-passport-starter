import React from "react";
import PropTypes from "prop-types";
import Header from "./Header";

Dashboard.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
  handleAuthChange: PropTypes.func.isRequired,
};

function Dashboard({ user, handleAuthChange }) {
  return (
    <div>
      <Header user={user} handleAuthChange={handleAuthChange} />
      <h1>Dashboard</h1>
    </div>
  );
}

export default Dashboard;
