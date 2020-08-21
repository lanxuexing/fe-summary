// Promise天生是一个类，类中需要一个参数：executor 执行器，默认立即执行。
// Promise内部提供类两个方法，可以更改promise的状态：等待、成功、失败
// 每一个Promise实例都要有一个then方法
const PENDING = 'PENDING';
const RESOLVE = 'RESOLVE';
const REJECT = 'REJECT';

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
        if (this.status === RESOLVE) {
            onfulfilled(this.value)
        }
        if (this.status === REJECT) {
            onrejected(this.reason)
        }
        // 异步逻辑处理
        if (this.status === PENDING) {
            this.onResolvedCallbacks.push(() => {
                // TODO ...切片编程
                onfulfilled(this.value)
            })
            this.onRejectedCallbacks.push(() => {
                // TODO ...切片编程
                onrejected(this.value)
            })
        }
    }
}

module.exports = Promise;