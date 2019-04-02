let url = require('url')
module.exports = function (req, res, next) {
  let {pathname, query} = url.parse(req.url, true)
  req.path = pathname 
  req.query = query
  next()
}