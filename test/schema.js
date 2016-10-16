const expect = require("expect");
const schema = require("../lib/schema");
const makeCtx = (prop, fn) => ({ resource: { [prop]: fn} });

const schemaMw = schema();

describe("#schema", function () {

  it("works with defaults", function () {
    return schemaMw(makeCtx("schema", () => true))
  });

  it("can provide resourceProp", function () {
    return schema({resourceProp: "okCheck"})(
      makeCtx("okCheck", () => true));
  });

  it("throws BadRequest if schemaFn resolves with falsy", function (done) {
    schemaMw(makeCtx("schema", () => {}))
      .catch(function (err) {
        expect(err.stack).toExist();
        expect(err.body).toBe("Bad Request");
        expect(err.status).toBe(400);
        done();
      });
  });

  it("rethrows an error from schemaFn as a BadRequest", function (done) {
    schemaMw(makeCtx("schema", () => { throw new Error("Kaboom!"); }))
      .catch(err => {
        expect(err.stack).toExist();
        expect(err.body).toBe("Kaboom!");
        expect(err.status).toBe(400);
        done();
      });
  });

  it("noop if no `schema` present", function () {
    const ctx = { resource: {} };
    return schemaMw(ctx).then(() =>
      expect(ctx).toEqual({ resource: {} })); // ctx is unchanged
  });
});
