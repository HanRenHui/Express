const Layer = require('./layer');
const methods = require('methods');
const slice = Array.prototype.slice;
function Route(path) {
    this.path = path;
    this.layers = [];
}
Route.prototype.handle_method = function (method) {
    method = method.toLowerCase();
    return this.methods[method];
}
methods.forEach(function (method) {
    Route.prototype[method] = function (...handler) {
        // push一层中所有的处理函数
        for (let i = 0; i < handler.length; i++) {
            let layer = new Layer('/', handler[i]);
            layer.method = method;
            this.layers.push(layer);
        }
        // this.methods[method] = true;
        return this;
    }
});

Route.prototype.dispatch = function (req, res, out) {
    let idx = 0, self = this;
    function next(err) {
        if (err) {//如果一旦在路由函数中出错了，则会跳过当前路由
            return out(err);
        }
        if (idx >= self.layers.length) {
            return out();//route.dispath里的out刚好是Router的next
        }
        let layer = self.layers[idx++];
        if (layer.method == req.method.toLowerCase()) {
            layer.callhandler(req, res, next);
        } else {
            next();
        }
    }
    next();
}
module.exports = Route;