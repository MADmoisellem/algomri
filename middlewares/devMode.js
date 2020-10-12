module.exports = (req, res, next) => {
  console.log("dev mode is on >>> ");
  req.session.currentUser = {
    _id: "5f6515d800be328c86413118",
    username: "kennews",
    avatar: "https://cdn.onlinewebfonts.com/img_258083.png",
    role: "admin",
    email: "ken@news.com",
  };
  next();
};
