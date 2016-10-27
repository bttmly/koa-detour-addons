const R = require("@nickbottomley/responses");
const pTry = require("p-try");

const PASS_FLAG = {};

// fetchFn should return promise of an "entity"
// if entity is null/undefined, NotFound error is thrown
// otherwise, entity is attached to ctx
function createFetchMiddleware (options = {}) {
  const { ctxProp = "fetched", resourceProp = "fetch" } = options;

  return function fetchMiddleware (ctx) {
    const fetchFn = ctx.resource[resourceProp];
    if (fetchFn == null) return Promise.resolve();
    return pTry(() => fetchFn(ctx)).then(fetched => {
      if (fetched == null) throw R.NotFound();
      if (fetched === PASS_FLAG) return;
      ctx[ctxProp] = fetched;
    });
  };
}

// use this as the middleware to make fetch a no-op
createFetchMiddleware.pass = () => PASS_FLAG;

module.exports = createFetchMiddleware;
