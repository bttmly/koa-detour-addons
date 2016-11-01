const R = require("response-objects");
const respond = require("../lib/respond");
const KoaDetour = require("koa-detour");
const expect = require("expect");

const createCtx = (url = "/", method = "GET") => {
  const ctx = {};
  ctx.headers = {};
  ctx.set = (k, v) => ctx.headers[k] = v;
  ctx.req = { url, method };
  ctx.res = {};
  return ctx;
};

const next = () => { throw new Error("Next shouldn't be called!") };

describe("#respond", function () {
  let ctx;
  beforeEach(() => ctx = createCtx());

  it("sets properties on `ctx` if handler returns a response object", function (done) {
    const resource = {
      GET: () => R.OK({ success: true }, {"x-test": true})
    };

    const handler = new KoaDetour()
      .apply(respond)
      .route("/", resource)
      .middleware();

    handler(ctx, next).then(function () {
      expect(ctx.body).toEqual({ success: true });
      expect(ctx.headers).toEqual({ "x-test": true });
      expect(ctx.status).toEqual(200);
      done();
    });
  });

  it("doesn't do anything if handler doesn't return a response object", function () {
    const resource = { GET: () => ({ success: true }) };

    const handler = new KoaDetour()
      .apply(respond)
      .route("/", resource)
      .middleware();

    handler(ctx, next).then(function () {
      expectCtxNotModified(ctx);
      done();
    });
  });

  it("promotes a resolution value to a R.Ok() if options.defaultOk", function () {
    const resource = { GET: () => ({ success: true }) };
    const router = new KoaDetour().route("/", resource)
    respond(router, {defaultOk: true});

    router.middleware()(ctx, next).then(function () {
      expect(ctx.body).toEqual({ success: true });
      expect(ctx.headers).toEqual({ "x-test": true });
      expect(ctx.status).toEqual(200);
      done();
    });
  });

  it("doesn't screw up a resolution value that is already a response object if options.defaultOk", function () {
    const resource = { GET: () => R.Created({ success: true }, { "x-test": true }) };
    const router = new KoaDetour().route("/", resource)
    respond(router, {defaultOk: true});

    router.middleware()(ctx, next).then(function () {
      expect(ctx.body).toEqual({ success: true });
      expect(ctx.status).toEqual(201);
      done();
    });
  });

  it("does not promote a null resolution value to a R.Ok() if options.defaultOk", function () {
    const resource = { GET: () => null };
    const router = new KoaDetour().route("/", resource)
    respond(router, {defaultOk: true});
    router.middleware()(ctx, next).then(function () {
      expectCtxNotModified(ctx);
      done();
    });
  });

  it("handles an undefined resolution", function () {
    const resource = { GET: () => {} };
    const router = new KoaDetour().route("/", resource)
    respond(router);
    router.middleware()(ctx, next).then(function () {
      expectCtxNotModified(ctx);
      done();
    });
  });

  it("rejects on undefined resolution if options.rejectOnUndefined", function (done) {
    const router = new KoaDetour().route("/", { GET: () => {} })
    respond(router, {rejectOnUndefined: true});
    router.middleware()(ctx, next).catch(function (err) {
      expect(err.message).toEqual("Received resolution value of `undefined` from resource");
      expectCtxNotModified(ctx);
      done();
    });
  });

  it("sets properties on `ctx` if handler rejects with a response error", function (done) {
    const resource = {
      GET: () => { throw R.BadRequest("Must provide id", { "x-test": true }); }
    };

    const handler = new KoaDetour()
      .apply(respond)
      .route("/", resource)
      .middleware();

    handler(ctx, next).then(function () {
      expect(ctx.body).toEqual("Must provide id");
      expect(ctx.headers).toEqual({ "x-test": true });
      expect(ctx.status).toEqual(400);
      done();
    });
  });

  it("rethrows if handler rejects with a non-response error", function (done) {
    const resource = {
      GET: () => { throw new Error("Kaboom!") }
    };

    const handler = new KoaDetour()
      .apply(respond)
      .route("/", resource)
      .middleware();

    handler(ctx, next).catch(function (err) {
      expect(err.message).toEqual("Kaboom!");
      expectCtxNotModified(ctx);
      done();
    });
  });

  it("accepts a custom responder", function (done) {

    const router = new KoaDetour()
      .route("/", { GET: () => R.OK("It is ok") })

    const responder = (resp, context) => {
      expect(resp).toEqual(R.OK("It is ok"));
      expect(ctx).toBe(context);
      done();
    };

    respond(router, {responder});

    router.middleware()(ctx, next);
  });

});

function expectCtxNotModified (ctx) {
  expect(ctx.body).toNotExist();
  expect(ctx.status).toNotExist();
  expect(ctx.headers).toEqual({});
}
