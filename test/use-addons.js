const expect = require("expect");
const useAddons = require("../lib");

function mockRouter () {
  const router = {
    _middleware: [],
    use (f) { router._middleware.push(f) },
  };
  return router;
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
