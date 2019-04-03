/**
 * body-parser 里的常用方法
 * json()
 * urlencoded()
 * txt()
 */

function urlencoded(option) {
  
  let { extended } = option
  return (req, res, next) => {
    let contentType = req.headers['content-type']
    if (contentType == 'application/x-www-form-urlencoded') {
      let buffer = []
      req.on('data', data => {
        buffer.push(data)
      })
      req.on('end', () => {
        let result = Buffer.concat(buffer).toString()
        
        if (extended) {
          // qs库可以处理嵌套对象
          req.body = qs.parse(result)
          next()
        } else {
          req.body = queryString.parse(result)
          next()
        }
      })

    } else {
      next()
    }
   
  }
}

function json() {
  return (req, res, next) => {
    let contentType = req.headers['content-type']
    if (contentType == 'application/json') {
      let buffer = []
      req.on('data', data => {
        buffer.push(data)
      })
      req.on('end', () => {
        let result = Buffer.concat(buffer).toString()
        req.body = JSON.parse(result)
        next()
      })

    } else {
      next()
    }
   
  }
}

function txt() {
  return (req, res, next) => {
    let contentType = req.headers['content-type']
    let type = contentType.split(';')[0]
    let charset = contentType.split(';')[1].split('=')[1]
    if (type === 'text/plain') {
      let buffer = []
      req.on('data', data => {
        buffer.push(data)
      })
      req.on('end', () => {
        let result = Buffer.concat(buffer)
        if (charset) {
          req.body = iconv.decode(result, charset)
        } else {
          req.body = result.toString()
        }
        next()
      })
    }
  }
}
