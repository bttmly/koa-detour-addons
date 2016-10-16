const authenticate = require("./authenticate");
const forbid = require("./forbid");
const schema = require("./schema");
const fetch = require("./fetch");
const respond = require("./respond");

function useAddons (router, options = {}) {
  router.use(authenticate, options.authenticate);
  router.use(forbid, options.forbid);
  router.use(schema, options.schema);
  router.use(fetch, options.fetch);
  respond(router, options.respond);
  return router;
}

useAddons.respond = respond;
useAddons.authenticate = authenticate;
useAddons.forbid = forbid;
useAddons.schama = schema;
useAddons.fetch = fetch;

module.exports = useAddons;
