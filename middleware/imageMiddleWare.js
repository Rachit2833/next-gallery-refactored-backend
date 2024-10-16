function addNewImageMiddleware(req, res, next) {
   console.log(req.body);
  next();
}
module.exports = { addNewImageMiddleware };
