const authenticate = require("./authenticate");
const allow = require("./allow");
const validate = require("./validate");
const fetch = require("./fetch");
const respond = require("./respond");

function useAddons (router, options = {}) {
  router.use(validate(options.validate))
  router.use(authenticate(options.authenticate));
  router.use(fetch(options.fetch));
  router.use(allow(options.allow));
  return router;
}

useAddons.respond = respond;
useAddons.authenticate = authenticate;
useAddons.allow = allow;
useAddons.validate = validate;
useAddons.fetch = fetch;

module.exports = useAddons;
