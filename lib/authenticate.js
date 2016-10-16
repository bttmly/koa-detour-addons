const R = require("@nickbottomley/responses");
const { callP } = require("./_util");

function createAuthenticateMiddleware (options = {}) {
  const { ctxProp = "user", resourceProp = "authenticate" } = options;

  return function authenticateMiddleware (ctx) {
    const authenticateFn = ctx.resource[resourceProp];
    if (authenticateFn == null) return Promise.resolve();
    return callP(authenticateFn, ctx).then(user => {
      if (user == null) throw R.Unauthorized();
      ctx[ctxProp] = user;
    });
  };
}

module.exports = createAuthenticateMiddleware;
