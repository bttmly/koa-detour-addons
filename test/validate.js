const expect = require("expect");
const validate = require("../lib/validate");
const makeCtx = (prop, fn) => ({ resource: { [prop]: fn} });

const validateMw = validate();

describe("#validate", function () {

  it("works with defaults", function () {
    return validateMw(makeCtx("validate", () => true))
  });

  it("can provide resourceProp", function () {
    return validate({resourceProp: "okCheck"})(
      makeCtx("okCheck", () => true));
  });

  it("throws BadRequest if validateFn resolves with falsy", function (done) {
    validateMw(makeCtx("validate", () => {}))
      .catch(function (err) {
        expect(err.stack).toExist();
        expect(err.body).toBe("Bad Request");
        expect(err.status).toBe(400);
        done();
      });
  });

  it("rethrows an error from validateFn as a BadRequest", function (done) {
    validateMw(makeCtx("validate", () => { throw new Error("Kaboom!"); }))
      .catch(err => {
        expect(err.stack).toExist();
        expect(err.body).toBe("Kaboom!");
        expect(err.status).toBe(400);
        done();
      });
  });

  it("noop if no `validate` present", function () {
    const ctx = { resource: {} };
    return validateMw(ctx).then(() =>
      expect(ctx).toEqual({ resource: {} })); // ctx is unchanged
  });
});
