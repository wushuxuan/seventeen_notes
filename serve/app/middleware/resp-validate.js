function validateResp (req, res, next) {
  console.log(res.body);
  next();
}

module.exports = validateResp