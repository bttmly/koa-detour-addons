const expect = require("expect");
const fetch = require("../lib/fetch");
const makeCtx = (prop, fn) => ({ resource: { [prop]: fn} });

const fetchMw = fetch();

describe("#fetch", function () {
  let entity;
  beforeEach(() => entity = {});

  it("works with defaults (return promise)", function () {
    const ctx = makeCtx("fetch", () => Promise.resolve(entity));
    return fetchMw(ctx).then(() => expect(ctx.fetched).toBe(entity));
  });

  it("works with defaults (return value)", function () {
    const ctx = makeCtx("fetch", () => entity);
    return fetchMw(ctx).then(() => expect(ctx.fetched).toBe(entity));
  });

  it("can provide ctxProp and resourceProp", function () {
    const ctx = makeCtx("fetcher", () => entity);
    return fetch({ctxProp: "wasFetched", resourceProp: "fetcher"})(ctx)
      .then(() => expect(ctx.wasFetched).toBe(entity));
  });

  it("throws NotFound if fetch returns nil", function (done) {
    fetchMw(makeCtx("fetch", () => {}))
      .catch(function (err) {
        expect(err.stack).toExist();
        expect(err.body).toBe("Not Found");
        expect(err.status).toBe(404);
        done();
      });
  });

  it("throws NotFound if fetch resolves to nil", function (done) {
    fetchMw(makeCtx("fetch", () => Promise.resolve()))
      .catch(function (err) {
        expect(err.stack).toExist();
        expect(err.body).toBe("Not Found");
        expect(err.status).toBe(404);
        done();
      });
  });

  it("noop if no `fetch` present", function () {
    const ctx = { resource: {} };
    return fetchMw(ctx).then(() =>
      expect(ctx).toEqual({ resource: {} })); // ctx is unchanged
  });

  it("is a noop if using fetch.pass", function () {
    const ctx = makeCtx("fetch", fetch.pass);
    return fetchMw(ctx).then(function () {
      expect(ctx).toEqual(makeCtx("fetch", fetch.pass)); // ctx is unchanged
    });
  });
});
