const { MARKER } = require("response-objects");

const UNDEF_MSG = "Received resolution value of `undefined` from resource";

function respondPlugin (router, options = {}) {
  const responder = options.responder || defaultResponder;

  return router
    .handleSuccess(function respondSuccess (ctx, result) {
      // defaultOk promotes regular old (non-response) objects to 200 responses
      if (result != null && result[MARKER] == null && options.defaultOk) {
        result = R.Ok(result);
      }

      // this helps catch cases where resource was supposed to respond
      // but unintentionally the promise resolved with nothing
      if (result === undefined && options.rejectOnUndefined) {
        throw new Error(UNDEF_MSG);
      }

      // explicitly returning null causes `respond` to always not run
      // if rejectOnUndefined wasn't set, we'll also bail out here
      if (result == null) return;

      // if the result isn't a response object, don't run
      if (result[MARKER] == null) return;
      responder(result, ctx);
    })
    .handleError(function respondError (ctx, err) {
      if (err[MARKER] == null) throw err;
      responder(err, ctx);
    });
}

function defaultResponder (resp, ctx) {
  ctx.body = resp.body;
  ctx.status = resp.status;
  Object.keys(resp.headers).forEach(function (h) {
    ctx.set(h, resp.headers[h]);
  });
}

module.exports = respondPlugin;
