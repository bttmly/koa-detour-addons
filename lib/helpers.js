function byMethod (methodMap) {
  return function (ctx) {
    const {method} = ctx;
    if (methodMap[method]) {
      return Promise.resolve()
        .then(() => methodMap[method](ctx))
    }

    if (methodMap.default) {
      return Promise.resolve()
        .then(() => methodMap.default(ctx))
    }

    throw new Error("No handler found for ")
  }
}

module.exports = {
  byMethod,
}
