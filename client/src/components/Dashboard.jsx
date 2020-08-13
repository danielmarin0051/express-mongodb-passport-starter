import React from "react";
import PropTypes from "prop-types";

Dashboard.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
};

function Dashboard({ user }) {
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
}

export default Dashboard;
