const expect = require("expect");
const authenticate = require("../lib/authenticate");

const makeCtx = (prop, fn) => ({ resource: { [prop]: fn} });

describe("#authenticate", function () {
  it("works with defaults", function () {
    const user = {};
    const mw = authenticate();
    const ctx = makeCtx("authenticate", function (ctx) {
      return Promise.resolve(user);
    });
    return mw(ctx).then(function () {
      expect(ctx.user).toBe(user);
    });
  });

  it("can provide ctxProp and resourceProp", function () {
    const user = {};
    const mw = authenticate({ctxProp: "theUser", resourceProp: "getUser"});
    const ctx = makeCtx("getUser", function (ctx) {
      return Promise.resolve(user);
    });
    return mw(ctx).then(function () {
      expect(ctx.theUser).toBe(user);
    })
  });

  it("throws Unauthorized if authenticate returns nil", function (done) {
    const mw = authenticate();
    const ctx = makeCtx("authenticate", function (ctx) {
      return Promise.resolve();
    });
    mw(ctx).catch(function (err) {
      expect(err.stack).toExist();
      expect(err.body).toBe("Unauthorized");
      expect(err.status).toBe(401);
      done();
    })
  });

  it("noop if no `authenticate` present", function () {
    const mw = authenticate();
    const ctx = { resource: {} };
    return mw(ctx).then(function () {
      expect(ctx).toEqual({ resource: {} }); // ctx is unchanged
    });
  });
});
