let Layer = require('./layer')

function Route() {
  this.routes = []
}
Route.prototype.get = function (handler) {
  let layer = new Layer('/', handler)
  layer.method = 'get'
  this.routes.push(layer) 
}

Route.prototype.dispatch = function (req, res, out) {
  let index = 0
  const next = () => {
    if (index >= this.routes) {
      // 这个地方其实是继续往下一层走
      return out()
    }
    let layer = this.routes[index++]

    if (layer.method === req.method.toLowerCase()) {
      layer.callhandler(req, res, next)
    } else {
      next()
    }
  }
  next()
}

module.exports = Route