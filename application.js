let Router = require('./router')
let http = require('http')
function Application() {
  this._router = new Router()
}

Application.prototype.get = function (path, handler) {
  this._router.get(path, handler)
}

Application.prototype.listen = function (...params) {

  http.createServer((req, res) => {
    const done = () => {
        res.end(`Cannot ${req.method} ${req.url}`)
    }
    this._router.handler(req, res, done)
  }).listen(...params)

}

module.exports = Application




