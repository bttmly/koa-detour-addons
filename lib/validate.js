const R = require("@nickbottomley/responses");
const pTry = require("p-try");

function createValidateMiddleware (options = {}) {
  const { resourceProp = "validate" } = options;

  return function validateMiddleware (ctx) {
    const validateFn = ctx.resource[resourceProp];
    if (validateFn == null) return Promise.resolve();
    return pTry(() => validateFn(ctx))
      .catch(err => { throw R.BadRequest(err.message); })
      .then(isOk => { if (!isOk) throw R.BadRequest(); })
  };
}

createValidateMiddleware.pass = () => true;

module.exports = createValidateMiddleware;
