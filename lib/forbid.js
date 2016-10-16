const R = require("@nickbottomley/responses");
const { callP } = require("./_util");

// forbidFn should return promise of a value representing
// access to the resource
// if falsy, Forbidden() is thrown
function createForbidMiddleware (options = {}) {
  const { resourceProp = "forbid" } = options;

  return function forbidMiddleware (ctx) {
    const forbidFn = ctx.resource[resourceProp];
    if (forbidFn == null) return Promise.resolve();
    return callP(forbidFn, ctx)
      .then(isAllowed => { if (!isAllowed) throw R.Forbidden(); });
  };
}

module.exports = createForbidMiddleware;
