const expect = require("expect");
const useAddons = require("../lib");

function mockRouter () {
  const mockRouter = {
    _middleware: [],
    use (f) { mockRouter._middleware.push(f); },
  };
  return mockRouter;
}

const order = [
  "validate",
  "authenticate",
  "fetch",
  "allow",
];

describe("#useAddons", function () {
  // this test is pretty fragile, it uses Function.name
  it("adds .use() middleware in the correct order", function () {
    const r = useAddons(mockRouter());
    r._middleware.forEach(function (mw, i) {
      expect(mw.name.startsWith(order[i])).toBe(true);
    });
  });
});
