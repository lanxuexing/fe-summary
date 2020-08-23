// 'use strict' // 使用严格模式

let Person = {}
/**
 * Object.defineProperty参数可选项：
 * @param configurable?: boolean
 * @param enumerable?: boolean
 * @param value?: any
 * @param writable?: boolean
 * @param get?(): any
 * @param set?(v: any): void
 */
Object.defineProperty(Person, 'name', {
    value: 'Jack',
    enumerable: true,
    writable: false,
    configurable: true
})

Object.defineProperty(Person, 'name', {
    value: 'rose'
})
// Person.name = 'rose'
console.log('Person:', Person.name)


/**
 * 存取描述符 --是由一对 getter、setter 函数功能来描述的属性
 * get：一个给属性提供getter的方法，如果没有getter则为undefined。该方法返回值被用作属性值。默认为undefined。
 * set：一个给属性提供setter的方法，如果没有setter则为undefined。该方法将接受唯一参数，并将该参数的新值分配给该属性。默认值为undefined。
 */
let Animal = {}
Object.defineProperty(Animal, 'name', {
    get: function () {
        return temp
    },
    set: function (val) {
        temp = val
    }
})

Animal.name = 'cat'
console.log('Animal:', Animal.name)

/*
 * 总结：
 * configurable: false 时，不能删除当前属性，且不能重新配置当前属性的描述符(有一个小小的意外：可以把writable的状态由true改为false,但是无法由false改为true),但是在writable: true的情况下，可以改变value的值
 * configurable: true时，可以删除当前属性，可以配置当前属性所有描述符。
 */