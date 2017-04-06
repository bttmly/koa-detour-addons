const expect = require("expect");
const useAddons = require("../lib");

const expectedOrder = [
  "validate",
  "authenticate",
  "fetch",
  "allow",
];

describe("#useAddons", function () {
  // this test is pretty fragile, it uses Function.name
  it("adds .use() middleware in the correct order", function () {

    const actualOrder = [];
    useAddons({ use (f) { actualOrder.push(f.name) } });
    expectedOrder.forEach(function (name, i) {
      expect(actualOrder[i].startsWith(name)).toBe(true);
    });
  });
});
