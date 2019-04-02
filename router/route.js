let Layer = require('./layer')
let methods = require('methods')
function Route() {
  this.layers = []
}

methods.forEach((method) => {
  Route.prototype[method] = function (...handler) {
    handler.forEach(h => {
      let layer = new Layer('/', h)
      layer.method = method
      this.layers.push(layer)  
    })

  }
})


Route.prototype.dispatch = function (req, res, out) {
  let index = 0
  const next = (err) => {
    if (index >= this.layers.length) {
      // 这个地方其实是继续往下一层走
      return out()
    }
    if (err) {
      return out(err)
    }
    let layer = this.layers[index++]
    
    if (layer.method === req.method.toLowerCase()) {
      layer.callhandler(req, res, next)
    } else {
      next()
    }
  }
  next()
}

module.exports = Route