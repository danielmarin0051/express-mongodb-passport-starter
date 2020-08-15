function checkAuthenticated(req, res, next) {
  // console.log("Checking if user is authenticated: ", req.isAuthenticated());
  if (req.isAuthenticated()) {
    next();
    return;
  }
  res.sendStatus(401);
}

function checkNotAuthenticated(req, res, next) {
  // console.log(
  //   "Checking if user is NOT authenticated: ",
  //   !req.isAuthenticated()
  // );
  if (!req.isAuthenticated()) {
    next();
    return;
  }
  res.sendStatus(401);
}

module.exports = {
  checkAuthenticated,
  checkNotAuthenticated,
};
