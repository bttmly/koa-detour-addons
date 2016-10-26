const R = require("@nickbottomley/responses");
const { callP } = require("./_util");

// allowFn should return promise of a value representing
// access to the resource
// if falsy, Forbidden() is thrown
function createAllowMiddleware (options = {}) {
  const { resourceProp = "allow" } = options;

  return function allowMiddleware (ctx) {
    const allowFn = ctx.resource[resourceProp];
    if (allowFn == null) return Promise.resolve();
    return callP(allowFn, ctx)
      .then(isAllowed => { if (!isAllowed) throw R.Forbidden(); });
  };
}

module.exports = createAllowMiddleware;
