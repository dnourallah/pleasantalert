import { error } from './utils/utils.js'
import { DismissReason } from './utils/DismissReason'
import {version} from '../../package.json'
import * as staticMethods from './staticMethods'
import * as instanceMethods from './instanceMethods'
import privateProps from './privateProps'

let currentInstance

// PleasantAlert constructor
function PleasantAlert (...args) {
  // Prevent run in Node env
  if (typeof window === 'undefined') {
    return
  }

  // Check for the existence of Promise
  if (typeof Promise === 'undefined') {
    error('This package requires a Promise library, please include a shim to enable it in this browser (See: https://github.com/dnourallah/pleasantalert/wiki/Migration-from-PleasantAlert-to-PleasantAlert2#1-ie-support)')
  }

  if (typeof args[0] === 'undefined') {
    error('PleasantAlert expects at least 1 attribute!')
    return false
  }

  currentInstance = this

  const outerParams = Object.freeze(this.constructor.argsToParams(args))

  Object.defineProperties(this, {
    params: {
      value: outerParams,
      writable: false,
      enumerable: true
    }
  })

  const promise = this._main(this.params)
  privateProps.promise.set(this, promise)
}

// `catch` cannot be the name of a module export, so we define our thenable methods here instead
PleasantAlert.prototype.then = function (onFulfilled, onRejected) {
  const promise = privateProps.promise.get(this)
  return promise.then(onFulfilled, onRejected)
}
PleasantAlert.prototype.catch = function (onRejected) {
  const promise = privateProps.promise.get(this)
  return promise.catch(onRejected)
}
PleasantAlert.prototype.finally = function (onFinally) {
  const promise = privateProps.promise.get(this)
  return promise.finally(onFinally)
}

// Assign instance methods from src/instanceMethods/*.js to prototype
Object.assign(PleasantAlert.prototype, instanceMethods)

// Assign static methods from src/staticMethods/*.js to constructor
Object.assign(PleasantAlert, staticMethods)

// Proxy to instance methods to constructor, for now, for backwards compatibility
Object.keys(instanceMethods).forEach(key => {
  PleasantAlert[key] = function (...args) {
    if (currentInstance) {
      return currentInstance[key](...args)
    }
  }
})

PleasantAlert.DismissReason = DismissReason

PleasantAlert.noop = () => { }

PleasantAlert.version = version

export default PleasantAlert
