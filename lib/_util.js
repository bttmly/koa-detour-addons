// guarantees sync throw/return gets wrapped in promise
exports.callP = function callP (fn, ...args) {
  return Promise.resolve().then(() => fn(...args));
}
