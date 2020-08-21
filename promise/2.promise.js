// promise可以解决链式调用问题
let promise = new Promise((resolve, reject) => {
    resolve('hello！')
});

promise.then(data => {
    return data // then方法中可以返回一个值（不是promise），会把这个结果放到下一次then成功回调里边
}).then(data => {
    return new Promise((resolve, reject) => { // 如果返回的是promise，那么会采用这个promise的结果
        setTimeout(() => {
            reject(data)
        }, 1000);
    })
}).then((data) => {
    console.log(data)
}, err => { // 如果在失败的函数中返回的普通值或者成功的promise也会走到外层的promise
    console.log('失败了: ', err)
}).then(() => {
    console.log('成功～')
    throw new Error('手动抛出错误～')
}).then(() => { }, err => {
    console.log('最后的失败: ', err)
}).catch(err => {
    console.log('catch捕获错误: ', err)
}).then((data) => {
    console.log('最后的成功: ', data)
})


// 成功：then中返回的是一个普通值，或者是一个promisee的时候（resolve）
// 失败：返回的是一个失败的promise，或者抛出异常 


// catch的特点是如果都没有错误处理（层层寻找）没有找到错误处理，会找最近的catch，catch也是then，遵循then的规范

// .then.then 并不是和jquer一样返回this，promise中实现链式调用主要靠的是返回一个新的promise