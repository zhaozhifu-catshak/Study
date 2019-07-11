'use strict';

// a simple http server

const http = require('http')
// 引入url模块来处理requset.url
const url = require('url')
// 引入node的路径模块
const path = require('path')

const fs = require('fs')
// process是一个全局的对象，argv[2]里存储的是用户在cmd中输入的第一个参数。
// 这样就能匹配到本地开启服务的文件夹的路径
// 这里如果没有输入参数，那么默认就是当前文件夹
const root = path.resolve(process.argv[2] || '.')

const defaultPageArr = ['default.html', 'index.html'];

const server = http.createServer((requset, response) => {
    // 通过url.parse方法来获取了url对象，里面存储了请求相关信息
    const pathname = url.parse(requset.url).pathname;
    //或者通过nodejs推荐使用的新api：new URL的方法来获取url对象，此方法不需要引入node的url模块,但是此方法的返回的对象和url.parse有所不同，注意看文档
    // const pathname = new URL(requset.url).pathname;

    // 这里通过path的join方法来拼接本地开启服务的文件夹中具体路径
    const rootPathname = path.join(root, pathname);
    console.log('本地路径:', rootPathname)
    // 这里通过fs.stat方法判断访问的具体信息
    fs.stat(rootPathname, (err, status) => {
        if (!err) {
            // 如果是文件
            if (status.isFile()) {
                response.writeHead(200)
                // 通过流的方式传递
                // response对象本身也是一个writable Stream，所以可以用readable Stream的pipe方法拼接
                fs.createReadStream(rootPathname).pipe(response)
            }
            // 如果是目录
            else if (status.isDirectory()) {
                let resArr = [];
                defaultPageArr.forEach((item, index) => {
                    try {
                        fs.openSync(path.join(rootPathname, item), 'r');
                        resArr.push(1);
                    }
                    catch (err) {
                        resArr.push(0);
                    }
                })
                resArr.forEach((item, index) => {
                    if (item === 1) {
                        response.writeHead(200);
                        fs.createReadStream(path.join(rootPathname, defaultPageArr[index])).pipe(response)
                    }
                })
            }
        }
        else {
            response.writeHead(404);
            response.end('erro')
        }
    })


})
server.listen('8080');