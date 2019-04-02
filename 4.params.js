// const express = require('express')
// const app = express() 
// app.param('uid', (req, res, next, val, name) => {
//   req.user = {
//     id: 1,
//     name: 'hrh'
//   }
//   next() 
// })
// app.param('uid', (req, res, next, val, name) => {
//   req.user.name = 'hrh2'
//   next() 
// })
// // 路径参数 因为参数是在路径里
// app.get('/user/:uid', (req, res) => {
//   console.log(req.params); // 路径参数对象

//   console.log(req.user);
//   res.end('user')  
// })

// app.listen(3000, () => {
//   console.log('Server is working on the http://localhost:3000');

// })

// let reg = /\/user\/([^\/]+)\/([^\/]+)/
// let url = '/user/1/2'
// console.log(reg.exec(url));
// let path = '/user/:uid'

// let pathToRegexp = require('path-to-regexp')
// let keys = []
// let result = pathToRegexp(path, keys)
// console.log(result);


let script = `
  let temp  =''
  with(obj) {
    if (user) {
      temp += 'hello username'
    } else {
      temp += 'hello guest'
    }
  }
  return temp
`;

// let fn = new Function('obj', script)
// console.log(fn({user: 1}));



let str = `
<% if(user){ %>
    hello user
<%}else{%> 
    hello guest
<%}%>
`;
let options = {
  user: {
    name: 'hrh',
    total: 5
  }
};
function render(str, options) {
  let head = "let tpl = ``;\nwith (obj) {\n tpl+=`";
  str = str.replace(/<%([\s\S]+?)%>/g, function () {
    return "`;\n" + arguments[1] + "\n;tpl+=`";
  });
  let tail = "`}\n return tpl; ";
  let html = head + str + tail;
  console.log(html);
  
  let fn = new Function('obj', html);
  return fn(options);
}
render(str, options)
console.log(render(str, options));

