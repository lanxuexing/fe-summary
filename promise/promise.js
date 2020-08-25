// Promise天生是一个类，类中需要一个参数：executor 执行器，默认立即执行。
// Promise内部提供类两个方法，可以更改promise的状态：等待、成功、失败
// 每一个Promise实例都要有一个then方法
const PENDING = 'PENDING';
const RESOLVE = 'RESOLVE';
const REJECT = 'REJECT';

// 判断x的状态（普通值或者是Promise），是让Promise2变成成功态或者是失败态
function resolvePromise(promise2, x, resolve, reject) {
    // 此方法为了兼容所有的promise，n个库中间执行的流程是一样的
    // 1. 不能引用同一个对象，会造成死循环
    if (promise2 === x) {
        return reject(new TypeError('Chaining cycle detected for promise #<Promise> at at processTicksAndRejections ...'))
    }

    // 2. 判断x的类型：x如果是对象或者函数，说明它有可能是一个promise
    if ((typeof x === 'object' && x != null) || typeof x === 'function') {
        // 有可能是一个promise
        try {
            let then = x.then // {a: 1} 因为then方法可能使用的是getter来定义的
            if (typeof then === 'function') { // 认为就是个promise
                // call 改变this指向，并且让函数执行
                then.call(
                    x,
                    (y) => {
                        resolve(y)
                    },
                    (r) => {
                        reject(r)
                    }
                )
            } else {
                // {a: 1, then: 2}
                resolve(x)
            }
        } catch (error) {
            reject(error) // 只要取值失败，就走失败的回调
        }
    } else [
        resolve(x)
    ]
}

class Promise {
    constructor(executor) {
        this.status = PENDING;
        this.value = undefined;
        this.reason = undefined;
        this.onResolvedCallbacks = [];
        this.onRejectedCallbacks = [];
        let resolve = (value) => {
            if (this.status === PENDING) {
                this.status = RESOLVE;
                this.value = value;

                // 依次执行异步方法
                this.onResolvedCallbacks.forEach(fn => fn())
            }
        }
        let reject = (reason) => {
            if (this.status === PENDING) {
                this.status = REJECT;
                this.reason = reason;

                // 依次执行异步方法
                this.onRejectedCallbacks.forEach(fn => fn())
            }
        }
        try {
            executor(resolve, reject);
        } catch (error) {
            console.log("Promise -> constructor -> error", error)
            reject(error) // 如果内部报错，直接将error手动的调用reject方法向下传递
        }
    }

    then(onfulfilled, onrejected) {
        let promise2 = new Promise((resolve, reject) => {
            if (this.status === RESOLVE) {
                // onfulfilled 和 onrejected 不能在当前上下文调用，在事件环中需要异步调用，
                // 应该是用macro-task宏任务【setTimeout、setImmediate】，或者使用micro-task微任务【MutationObserver、process.nextTick】
                setTimeout(() => {
                    try {
                        let x = onfulfilled(this.value)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (error) { // 一旦执行then方法报错，就走到外层then的错误方法reject里
                        console.log('====', error)
                        reject(error)
                    }
                }, 0);
            }
            if (this.status === REJECT) {
                setTimeout(() => {
                    try {
                        let x = onrejected(this.reason)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (error) {
                        reject(error)
                    }
                }, 0);
            }
            // 异步逻辑处理
            if (this.status === PENDING) {
                this.onResolvedCallbacks.push(() => {
                    // ...切片编程
                    setTimeout(() => {
                        try {
                            let x = onfulfilled(this.value)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (error) {
                            reject(error)
                        }
                    }, 0);
                })
                this.onRejectedCallbacks.push(() => {
                    // ...切片编程
                    setTimeout(() => {
                        try {
                            let x = onrejected(this.reason)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (error) {
                            reject(error)
                        }
                    }, 0);
                })
            }
        })
        return promise2 // 每次then都返回一个新的Promise
    }
}

module.exports = Promise;