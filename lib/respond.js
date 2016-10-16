const { MARKER } = require("@nickbottomley/responses");

function respondPlugin (router, options = {}) {
  return router
    .handleSuccess(function (ctx, result) {
      if (result != null && options.defaultOk) {
        result = R.Ok(result);
      }

      // if (options.nullToNoContent) { /* */ }

      if (result[MARKER] == null) return;
      apply(ctx, result);
    })
    .handleError(function (ctx, err) {
      if (err[MARKER] == null) throw err;
      apply(ctx, err);
    });
}

function apply (ctx, resp) {
  ctx.body = resp.body;
  ctx.status = resp.status;
  Object.keys(resp.headers).forEach(function (h) {
    ctx.set(h, resp.headers[h]);
  });
}

module.exports = respondPlugin;
