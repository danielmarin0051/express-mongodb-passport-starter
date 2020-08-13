function checkAuthenticated(req, res, next) {
  console.log("Checking if user is authenticated: ", req.isAuthenticated());
  if (req.isAuthenticated()) {
    next();
    return;
  }
  res.status(401).json({
    authenticated: false,
    user: null,
  });
}

function checkNotAuthenticated(req, res, next) {
  console.log(
    "Checking if user is NOT authenticated: ",
    !req.isAuthenticated()
  );
  if (!req.isAuthenticated()) {
    next();
    return;
  }
  res.status(401).json({
    authenticated: true,
    user: res.user,
  });
}

module.exports = {
  checkAuthenticated,
  checkNotAuthenticated,
};
