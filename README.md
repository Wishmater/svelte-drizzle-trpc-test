# Introduction

Collection of our preferred libraries / tools to use with SvelteKit for building web apps.


# Developing

To run the project locally:
```bash
npm run dev
```


# Building

To create a production version of your app:

```bash
npm run build
```
To run the production version locally:
```bash
node build
```


# Technologies / Tools used


## Language / Linters

### Typescript (mandatory)
Typescript = good, also native to svelteKit.

### Vite (mandatory)
Used by svelteKit to build project.

### Eslint + Prettier (optional)
In the long run, it is better to standardize code. Even if the standard is bad, it's better than no standard. Make sure to enable eslint + prettier formatter on save on your IDE. Check example project for ts and svelte plugins.


## Backend

### [SvelteKit](https://svelte.dev/docs/kit/introduction) (mandatory)
SvelteKit is GREAT for web apps and has REALLY GOOD [documentation](https://svelte.dev/docs/kit/introduction). The only case where I would not use SvelteKit is for an almost-static website with no DB, in which case I'd go with Astro (and maybe even drop Svelte at that point in favor of Astro components). 

### [DrizzleORM](https://orm.drizzle.team/) (optional)
Easy way to fully handle a DB, includes schema, migration, and type-safe queries.
Supports a lot of DBs, like PostgreSQL and SQLite, probably better to use SQLite since we're using this for simple projects anyways.
<br>Good starting points for learning:
<br>  [Schema declaration basics](https://orm.drizzle.team/docs/sql-schema-declaration)
<br>  [SQLite connection](https://orm.drizzle.team/docs/get-started-sqlite)
<br>  [SQLite schema column types](https://orm.drizzle.team/docs/column-types/sqlite) (also see example in this repo for how to handle dates and enums)
<br>  [Schema relations](https://orm.drizzle.team/docs/relations)
<br>  [Queries](https://orm.drizzle.team/docs/rqb)
<br>  [Generate Valibot schema from Drizzle schema](https://orm.drizzle.team/docs/valibot)
<br>Drizzle offers a lot of value: by declaring DB schemas once, we also get TS types and Valibot schema validators, we don't have to repeat 3 times: DB + model + validation.
It probably gets worse the more complex the database is, at which point the only solution so far is to manually manage the DB (and probably not use a JS backend at that point, at least for the API part).
<br><br>To migrate DB schema (assuming fully managed by Drizzle, read migration types):
```bash
npx drizzle-kit push
```
To launch Drizzle Studio db inspector:
```bash
npx drizzle-kit studio
```

## Back-Front Communication

### [Valibot](https://valibot.dev/) (mandatory)
Generally better than Zod: more lightweight and more customizable.

### [SveltKit load() APIs](https://svelte.dev/docs/kit/load) (optional)
For simpler apps, ideally we can just use SvelteKit's load() and actions APIs. 
These are type-safe and also forces you to put state into the url/cookies, which is good.
Especially interesting is the [streaming load() promises API](), this allow us to have SSR with immediate response, and then stream down data from DB that takes longer to load (for prod be careful about [nginx config and other bugs](https://github.com/sveltejs/kit/issues/9534), test well).

### [REST API]() (optional)
On more complicated webapps, we might need a full-blown custom RESTful API.
Ideally, we also use OpenAPI definitions to generate types and serialization code.
At this point, we might as well use a real language in the backend.
<br>Options for generating frontend types and APIs (haven't tried them yet):
<br>  https://github.com/astahmer/typed-openapi
<br>  https://github.com/OpenAPITools/openapi-generator-cli
<br>If for some reason we're still using JS on the backend, try generating openAPI specs from zod schema definitions:
<br>  https://www.speakeasy.com/openapi/frameworks/zod
<br>  https://github.com/asteasolutions/zod-to-openapi

### [tRPC](https://icflorescu.github.io/trpc-sveltekit/) (NO)
Really convoluted and hacky. 
Has to use its own router instead of integrating with svelteKit.
Type inference (its main sale point) is buggy and hard to implement.

## Frontend

### [Svelte](https://svelte.dev/docs/svelte/overview) (mandatory)
Best frontend JS framework by far, and also integrates with SvelteKit, of course.

### [Tailwind](https://tailwindcss.com/docs/installation) (mandatory)
Tailwind = good.

### SvelteHeroIcons (mandatory)

### Some higher level library on top of tailwind (optional)
The UI can be built with html / tailwind alone, but it's often useful to have higher level components, especially since we dont have designers.

#### Material-Tailwind
Headless tailwind components. The only sane way to use it is to create our own Svelte components from it and use them.

#### [ShadCN](https://www.shadcn-svelte.com/)

#### [Flowbite](https://flowbite-svelte.com/)

#### SkeletonUI (NO (dice Fide))

#### DaisyUI (NO)
Trying to do high complexity components is even discouraged in the tailwind documentation itself.
Daisy often interferes with vanilla tailwind and makes it so you can't copy/paste tailwind code without it breaking.
Ideally, we want a library that declares Svelte components, or headless tailwind components to create our own.




# Pending 
- Auth.
- Add more details about ESLint / Prettier, including links and configuration.

# Now:
- Test SvelteHeroIcons (and write on readme)
- Minimal test of load() API
- LoggerJS
- 