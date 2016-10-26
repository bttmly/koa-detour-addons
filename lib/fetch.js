const R = require("@nickbottomley/responses");
const { callP } = require("./_util");

// fetchFn should return promise of an "entity"
// if entity is null/undefined, NotFound error is thrown
// otherwise, entity is attached to ctx
function createFetchMiddleware (options = {}) {
  const { ctxProp = "fetched", resourceProp = "fetch" } = options;

  return function fetchMiddleware (ctx) {
    const fetchFn = ctx.resource[resourceProp];
    if (fetchFn == null) return Promise.resolve();
    return callP(fetchFn, ctx).then(fetched => {
      if (fetched == null) throw R.NotFound();
      ctx[ctxProp] = fetched;
    });
  };
}

module.exports = createFetchMiddleware;
