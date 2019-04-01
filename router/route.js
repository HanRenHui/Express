let Layer = require('./layer')

function Route() {
  this.layers = []
}
Route.prototype.get = function (handler) {
  let layer = new Layer('/', handler)
  layer.method = 'get'
  this.layers.push(layer) 
  
}

Route.prototype.dispatch = function (req, res, out) {
  let index = 0
  const next = () => {
    if (index >= this.layers.length) {
      // 这个地方其实是继续往下一层走
      return out()
    }
    let layer = this.layers[index++]
    console.log(layer);
    
    if (layer.method === req.method.toLowerCase()) {
      // console.log(next);
      console.log(index);
      
      
      layer.callhandler(req, res, next)
    } else {
      next()
    }
  }
  next()
}

module.exports = Route