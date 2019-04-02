let Layer = require('./layer')
let Route = require('./route')
let url = require('url')
let methods = require('methods')

let proto = Object.create(null)

function Router() {
  // 兼容二级路由
  function router(req, res, next) {
    router.handler(req, res, next);
  }
  router.stack = []
  // router.stucks = []
  Object.setPrototypeOf(router, proto)
  return router
}


methods.forEach(method => {

  proto[method] = function (path, ...handler) {
    let route = new Route()
    // 往route的同一层里添加
    route[method](...handler)
    let layer = new Layer(path, route.dispatch.bind(route))
    
    layer.methods[method] = true
    layer.route = route


    // 往栈里添加
    this.stack.push(layer)
  }
})

proto.use = function (path, handler) {

  if (typeof handler !== 'function') {
    handler = path
    path = '/'
  }
  let layer = new Layer(path, handler)
  
  // 这个字段用来区分中间件
  layer.route = undefined

  this.stack.push(layer)

}


proto.handler = function (req, res, out) {
  let index = 0
  // 被移除的字符串
  let removed = ''
  // console.log(this.stack);

  const next = err => {
    if (removed.length > 0) {
      req.url = removed + req.url
      removed = ''
    }
    if (index >= this.stack.length) {
      return out()
    }
    let layer = this.stack[index++]

    let { pathname } = url.parse(req.url)
    
    if (layer.matchPath(pathname)) {
      if (!layer.route) { // 这一层是中间件 
        removed = layer.path  // /user
        req.url = req.url.slice(removed.length) // /2
        if (err) {
          layer.handle_error(err, req, res, next)
        } else {
          layer.callhandler(req, res, next)
        }
      } else {
        if (layer.route && layer.methods[req.method.toLowerCase()]) {
          layer.callhandler(req, res, next)
        } else {
          next()
        }
      }
    } else {
      next()
    }
  }
  next()
}

module.exports = Router