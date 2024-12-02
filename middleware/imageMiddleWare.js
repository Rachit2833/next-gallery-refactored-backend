function addNewImageMiddleware(req, res, next) {
   console.log(req.body);
  next();
}

function searchThrottle(req,res,next) {
  setTimeout(()=>{
    console.log("hello world");
    next();
  },5000)

}
module.exports = { addNewImageMiddleware ,searchThrottle };
