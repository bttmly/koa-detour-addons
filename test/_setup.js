// file named w/ underscore so mocha hits it first
process.on("unhandledRejection", err => { throw err; });
console.log("  test setup complete..");
