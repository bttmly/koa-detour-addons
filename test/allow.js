const expect = require("expect");
const allow = require("../lib/allow");
const makeCtx = (prop, fn) => ({ resource: { [prop]: fn} });
const allowMw = allow();

describe("#allow", function () {
  it("works with defaults", function () {
    return allowMw(makeCtx("allow", () => true));
  });

  it("can provide resourceProp", function () {
    return allow({resourceProp: "authorize"})(
      makeCtx("authorize", () => true)
    );
  });

  it("throws Forbidden if fetch returns falsy", function (done) {
    const ctx = makeCtx("allow", () => false);
    allowMw(ctx).catch(function (err) {
      expect(err.stack).toExist();
      expect(err.body).toBe("Forbidden");
      expect(err.status).toBe(403);
      done();
    })
  });

  it("noop if no `fetch` present", function () {
    const ctx = { resource: {} };
    return allowMw(ctx).then(function () {
      expect(ctx).toEqual({ resource: {} }); // ctx is unchanged
    });
  });
});
