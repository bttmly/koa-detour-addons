const expect = require("expect");
const useAddons = require("../lib");

function mockRouter () {
  const mockRouter = {
    successHandler: null,
    errorHandler: null,
    middleware: [],
    use (f) { mockRouter.middleware.push(f); },
    handleSuccess (f) { mockRouter.successHandler = f; return mockRouter; },
    handleError (f) { mockRouter.errorHandler = f; return mockRouter; },
  };
  return mockRouter;
}

const order = [
  "schema",
  "authenticate",
  "fetch",
  "forbid",
];

describe("#useAddons", function () {
  // this test is pretty fragile, it uses Function.name
  it("adds .use() middleware in the correct order", function () {
    const r = useAddons(mockRouter());
    r.middleware.forEach(function (mw, i) {
      expect(mw.name.startsWith(order[i])).toBe(true);
    });
  });

  it("installs the respond handlers", function () {
    const r = useAddons(mockRouter());
    const { successHandler, errorHandler } = r;
    expect(successHandler.name).toBe("respondSuccess");
    expect(errorHandler.name).toBe("respondError");
  });
});
