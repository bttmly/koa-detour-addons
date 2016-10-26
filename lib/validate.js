const R = require("@nickbottomley/responses");
const { callP } = require("./_util");

function createValidateMiddleware (options = {}) {
  const { resourceProp = "validate" } = options;

  return function validateMiddleware (ctx) {
    const validateFn = ctx.resource[resourceProp];
    if (validateFn == null) return Promise.resolve();
    return callP(validateFn, ctx)
      .catch(err => { throw R.BadRequest(err.message); })
      .then(isOk => { if (!isOk) throw R.BadRequest(); })
  };
}

module.exports = createValidateMiddleware;
