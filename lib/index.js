const authenticate = require("./authenticate");
const forbid = require("./forbid");
const schema = require("./schema");
const fetch = require("./fetch");
const respond = require("./respond");

function useAddons (router, options = {}) {
  router.use(schema(options.schema))
  router.use(authenticate(options.authenticate));
  router.use(fetch(options.fetch));
  router.use(forbid(options.forbid));
  respond(router, options.respond);
  return router;
}

useAddons.respond = respond;
useAddons.authenticate = authenticate;
useAddons.forbid = forbid;
useAddons.schama = schema;
useAddons.fetch = fetch;

module.exports = useAddons;
