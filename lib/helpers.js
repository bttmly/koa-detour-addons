const pTry = require("p-try");

function byMethod (methodMap) {
  return function (ctx) {
    const method = ctx.method.toUpperCase();

    if (methodMap[method]) {
      return pTry(() => methodMap[method](ctx));
    }

    if (methodMap.default) {
      return pTry(() => methodMap.default(ctx));
    }

    throw new Error(`No 'byMethod' handler found for ${ctx.method} ${ctx.url}`);
  };
}

module.exports = {
  byMethod,
};
