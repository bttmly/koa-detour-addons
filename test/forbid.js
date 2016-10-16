const expect = require("expect");
const forbid = require("../lib/forbid");
const makeCtx = (prop, fn) => ({ resource: { [prop]: fn} });
const forbidMw = forbid();

describe("#forbid", function () {
  it("works with defaults", function () {
    return forbidMw(makeCtx("forbid", () => true));
  });

  it("can provide resourceProp", function () {
    return forbid({resourceProp: "authorize"})(
      makeCtx("authorize", () => true)
    );
  });

  it("throws Forbidden if fetch returns falsy", function (done) {
    const ctx = makeCtx("forbid", () => false);
    forbidMw(ctx).catch(function (err) {
      expect(err.stack).toExist();
      expect(err.body).toBe("Forbidden");
      expect(err.status).toBe(403);
      done();
    })
  });

  it("noop if no `fetch` present", function () {
    const ctx = { resource: {} };
    return forbidMw(ctx).then(function () {
      expect(ctx).toEqual({ resource: {} }); // ctx is unchanged
    });
  });
});
