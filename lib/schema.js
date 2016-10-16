const R = require("@nickbottomley/responses");
const { callP } = require("./_util");

function createSchemaMiddleware (options = {}) {
  const { resourceProp = "schema" } = options;

  return function schemaMiddleware (ctx) {
    const schemaFn = ctx.resource[resourceProp];
    if (schemaFn == null) return Promise.resolve();
    return callP(schemaFn, ctx)
      .catch(err => { throw R.BadRequest(err.message); })
      .then(isOk => { if (!isOk) throw R.BadRequest(); })
  };
}

module.exports = createSchemaMiddleware;
