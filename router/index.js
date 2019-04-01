let Layer = require('./layer')
let Route = require('./route')
let url = require('url')
function Router() {
  this.layers = []
}

Router.prototype.get = function (path, handler) {
  let route = new Route() 
  route.get(handler)
  let layer = new Layer(path, route.dispatch.bind(route))
  layer.methods['get'] = true
  layer.route = route
  this.layers.push(layer)
}

Router.prototype.handler = function (req,res, out) {
  let index = 0
  const next = () => {
    if (index >= this.layers.length) {
      return out()
    }
    let layer = this.layers[index++] 
    let { pathname } = url.parse(req.url)
    if ((pathname === layer.path) && (layer.methods[req.method.toLowerCase()])) {
      layer.callhandler(req, res, next)
    } else {
      next()
    }
  }
  next()
}

module.exports = Router