let Layer = require('./layer')
let Route = require('./route')
let url = require('url')
let methods = require('methods')
function Router() {
  this.layers = []
}

methods.forEach(method => {
  
  Router.prototype[method] = function (path, ...handler) {
    let route = new Route() 
    // 往route的同一层里添加
    route[method](...handler)
    let layer = new Layer(path, route.dispatch.bind(route))
    layer.methods[method] = true
    layer.route = route 
    // 往栈里添加
    this.layers.push(layer)
  }
})



Router.prototype.handler = function (req,res, out) {
  let index = 0
  const next = err => {
    if (index >= this.layers.length) {
      return out()
    }
    let layer = this.layers[index++] 
    
    let { pathname } = url.parse(req.url)
    if ((pathname === layer.path) && (layer.methods[req.method.toLowerCase()])) {
      // 处理错误
      if (err) {
        layer.handle_error(err, req, res, next)
      } else {
        layer.callhandler(req, res, next)
      }
    } else {
      next()
    }
  }
  next()
}

module.exports = Router