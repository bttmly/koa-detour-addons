const expect = require("expect");
const authenticate = require("../lib/authenticate");
const authenticateMw = authenticate();
const makeCtx = (prop, fn) => ({ resource: { [prop]: fn} });

describe("#authenticate", function () {
  it("works with defaults (return promise)", function () {
    const user = {};
    const ctx = makeCtx("authenticate", () => Promise.resolve(user));
    return authenticateMw(ctx).then(function () {
      expect(ctx.user).toBe(user);
    });
  });

  it("works with defaults (return value)", function () {
    const user = {};
    const ctx = makeCtx("authenticate", () => user);
    return authenticateMw(ctx).then(function () {
      expect(ctx.user).toBe(user);
    });
  });

  it("can provide ctxProp and resourceProp", function () {
    const user = {};
    const mw = authenticate({ctxProp: "theUser", resourceProp: "getUser"});
    const ctx = makeCtx("getUser", () => Promise.resolve(user));
    return mw(ctx).then(function () {
      expect(ctx.theUser).toBe(user);
    });
  });

  it("throws Unauthorized if authenticate resolves to nil", function (done) {
    const ctx = makeCtx("authenticate", () => Promise.resolve());
    authenticateMw(ctx).catch(function (err) {
      expect(err.stack).toExist();
      expect(err.body).toBe("Unauthorized");
      expect(err.status).toBe(401);
      done();
    });
  });

  it("throws Unauthorized if authenticate returns nil", function (done) {
    const ctx = makeCtx("authenticate", () => {});
    authenticateMw(ctx).catch(function (err) {
      expect(err.stack).toExist();
      expect(err.body).toBe("Unauthorized");
      expect(err.status).toBe(401);
      done();
    });
  });

  it("noop if no `authenticate` present", function () {
    const ctx = { resource: {} };
    return authenticateMw(ctx).then(function () {
      expect(ctx).toEqual({ resource: {} }); // ctx is unchanged
    });
  });

  it("is a noop if using authenticate.pass", function () {
    const ctx = makeCtx("authenticate", authenticate.pass);
    return authenticateMw(ctx).then(function () {
      expect(ctx).toEqual(makeCtx("authenticate", authenticate.pass)); // ctx is unchanged
    });
  });
});
