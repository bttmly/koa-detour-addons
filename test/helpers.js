const expect = require("expect");
const fetch = require("../lib/fetch");
const makeCtx = (prop, fn) => ({ resource: { [prop]: fn} });

const helpers = require("../lib/helpers");

const putEntity = { name: "put" };
const getEntity = { name: "get" };
const defaultEntity = { name: "default" };
const mw = fetch();

describe("helpers", function () {

  describe("#byMethod", function () {
    it("dispatches on method", function () {
      const fetcher = helpers.byMethod({
        GET: () => getEntity,
        PUT: () => putEntity,
      });

      return Promise.resolve()
        .then(() => {
          const ctx = makeCtx("fetch", fetcher);
          ctx.method = "get";
          return mw(ctx).then(() => expect(ctx.fetched).toBe(getEntity));
        })
        .then(() => {
          const ctx = makeCtx("fetch", fetcher);
          ctx.method = "PUT";
          return mw(ctx).then(() => expect(ctx.fetched).toBe(putEntity));
        });

    });

    it("`default` works if no match", function () {
      const fetcher = helpers.byMethod({
        GET: () => getEntity,
        default: () => defaultEntity,
      });

      return Promise.resolve()
        .then(() => {
          const ctx = makeCtx("fetch", fetcher);
          ctx.method = "get";
          return mw(ctx).then(() => expect(ctx.fetched).toBe(getEntity));
        })
        .then(() => {
          const ctx = makeCtx("fetch", fetcher);
          ctx.method = "PUT";
          return mw(ctx).then(() => expect(ctx.fetched).toBe(defaultEntity));
        });
    });

    it("errors if no default and method defined", function (done) {
      const fetcher = helpers.byMethod({});

      Promise.resolve()
        .then(() => {
          const ctx = makeCtx("fetch", fetcher);
          ctx.method = "POST";
          ctx.url = "/entity";
          return mw(ctx).catch(function (err) {
            expect(err.message).toBe("No 'byMethod' handler found for POST /entity");
            done();
          });
      });
    });

  });
});
