// NOTE -- 'respond' is a not-great name for this. Specifically, this module
// is *not* meant to send an HTTP response, but rather to take the value
// or error that resulted from the router's handling stack and set up the
// Koa context object such that Koa's response-sending machinery can do the
// right thing.

const R = require("response-objects");

const UNDEF_MSG = "Received resolution value of `undefined` from resource";

function respondPlugin (router, options = {}) {
  const mw = router.middleware();
  const handleOk = makeRespondSuccess(options);
  const handleErr = makeRespondError(options);
  return function (ctx, next) {
    return mw(ctx, next)
      .then(result => handleOk(ctx, result))
      .catch(err => handleErr(ctx, err));
  };
}

// NOTE -- moving these into `makeRespond` functions so they can be exposed.
// Purpose is `handleSuccess()` and `handleError()` are being deprecated in
// favor of using `then()` and `catch()` on result of `router.middleware()`.
// These handlers can then be applied by the caller directly. Some other, more
// ergonomic wrapper might be provided in the future. Also adding `return` to
// each to enable async responders.

function makeRespondSuccess (options = {}) {
  const { responder = defaultResponder } = options;
  return function respondSuccess (ctx, result) {
    const default200 = options.default200 || options.defaultOk;
    // defaultOk promotes regular old (non-response) objects to 200 responses
    if (result != null && result[R.MARKER] == null && default200) {
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
    if (result[R.MARKER] == null) return;

    return responder(result, ctx);
  };
}

function makeRespondError (options = {}) {
  const { responder = defaultResponder } = options;
  return function respondError (ctx, err) {
    if (err[R.MARKER] == null && options.default500) {
      err = R.InternalServerError(err);
    }

    if (err[R.MARKER] == null) {
      throw err;
    }

    return responder(err, ctx);
  };
}

function defaultResponder (resp, ctx) {
  ctx.body = resp.body;
  ctx.status = resp.status;
  Object.keys(resp.headers).forEach(function (h) {
    ctx.set(h, resp.headers[h]);
  });
}

respondPlugin.makeRespondSuccess = makeRespondSuccess;
respondPlugin.makeRespondError = makeRespondError;

module.exports = respondPlugin;
