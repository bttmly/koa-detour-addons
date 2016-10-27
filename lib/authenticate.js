const R = require("@nickbottomley/responses");
const pTry = require("p-try");

const PASS_FLAG = {};

function createAuthenticateMiddleware (options = {}) {
  const { ctxProp = "user", resourceProp = "authenticate" } = options;

  return function authenticateMiddleware (ctx) {
    const authenticateFn = ctx.resource[resourceProp];
    if (authenticateFn == null) return Promise.resolve();
    return pTry(() => authenticateFn(ctx)).then(user => {
      if (user === PASS_FLAG) return;
      if (user == null) throw R.Unauthorized();
      ctx[ctxProp] = user;
    });
  };
}

// use this as the middleware to make authenticate a no-op
createAuthenticateMiddleware.pass = () => PASS_FLAG;

module.exports = createAuthenticateMiddleware;
