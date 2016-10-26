# koa-detour-addons

[![Build Status](https://travis-ci.org/nickb1080/koa-detour-addons.svg?branch=master)](https://travis-ci.org/nickb1080/koa-detour-addons)
[![Coverage Status](https://coveralls.io/repos/github/nickb1080/koa-detour-addons/badge.svg?branch=master)](https://coveralls.io/github/nickb1080/koa-detour-addons?branch=master)

A small collection of helpful middleware for [koa-detour]().

`koa-detour` and `koa-detour-addons` are designed to simplify the development of REST APIs.

```js
const R = require("@nickbottomley/responses");

// this whole object is considered a single "resource"
const resource = {

  // if this method resolves to something falsy, response is a 400
  // otherwise, processing continues
  validate (ctx) {
    if (ctx.method !== "POST" && ctx.method !== "PUT") return;
    return applySchema(ctx, { title: String, isbn: String });
  },

  // something upstream is (in this case) responsible for populating ctx.user
  // if this method resolves to something falsy, response is 401
  // otherwise, processing continues
  authenticate (ctx) {
    return ctx.user && ctx.user.type === "author";
  },

  // if this method resolves to something falsy, response is 403
  // otherwise processing continues
  allow (ctx) {
    // ctx.user is defined now
    return Books.isByAuthor(ctx.body.isbn, ctx.user);
  },

  // if this method resolves to null/undefind, response is 404
  // otherwise, the value is provided as "ctx.fetched"
  fetch (ctx) {
    return Books.findByIsbn(ctx.body.isbn)
  },

  // handles GET requests
  GET (ctx) {
    return R.Ok(ctx.fetched);
  },

  // handles DELETE requests
  DELETE (ctx) {
    const {id} = ctx.fetched;
    // R.NoContent() is a 204 response; `respond` add-on takes care of the details
    return Books.deleteById(id).then(R.NoContent)
  }

  POST (ctx) {
    // `validate` middleware already checked the validity of `ctx.body`
    // R.Created() is a 201 response; `respond` add-on takes care of the details
    return Books.create(ctx.body).then(R.Created)
  }
};

const KoaDetourRouter = require("koa-detour");
const router = new KoaDetourRouter()
  .apply(require("koa-detour-addons"))
  .route("/books", booksResource);

const Koa = require("koa");
const app = new Koa().use(router);
```

### `validate` middleware
`type SchemaFn = (ctx: KoaContext) => Promise<Boolean>`

The `validate` should return a Promise or value representing whether the request is valid or not. If that value is falsy, a 400 response (Bad Request) is sent automatically.

### `authenticate` middleware
`type AuthenticateFn = (ctx: KoaContext) => Promise<Boolean>`

The `authenticate` should return a Promise or value representing whether the request is from a properly authenticated user. If that value is falsy, a 401 response (Unauthorized) is sent automatically.

### `allow` middleware
`type ForbidFn = (ctx: KoaContext) => Promise<Boolean>`

The `allow` should return a Promise or value representing whether the current user has access to the requested resource. If that value is falsy, a 403 response (Forbidden) is sent automatically.

### `fetch` middleware
`type FetchFn = (ctx: KoaContext) => Promise<Object?>`

The `fetch` should return a Promise or value of the business object being requested. If that value is null or undefined, a 404 response (NotFound) is sent automatically.

### `respond` plugin
The `respond` plugin is responsible for interfacing between [response objects](https://github.com/nickb1080/responses) and the Koa context object. In particular, it allows middleware and resources to `return` or `throw` response objects and have them handled properly.
