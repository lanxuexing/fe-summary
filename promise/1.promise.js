// 官方文档：https://promisesaplus.com/
let Promise = require('./promise');

// Promise天生是一个类，类中需要一个参数：executor 执行器，默认立即执行。
// Promise内部提供类两个方法，可以更改promise的状态：等待、成功、失败
// Promise是为了解决异步问题，并发处理
let promise = new Promise((resolve, reject) => {
    console.log('执行了....');
    // throw Error('出了点状况...')
    
    setTimeout(() => {
        resolve('今天是周五啦啦啦～')
    }, 100);
});

promise.then(
    (data) => { // onfulfilled 成功回调
        console.log(data)
    },
    (err) => { // onrejected 失败回调
        console.log(err)
    }
)