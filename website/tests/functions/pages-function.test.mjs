import assert from "node:assert/strict";
import test from "node:test";

import { onRequest } from "../../functions/[[path]].js";

const siteOrigin = "https://preview.silvia-dinu-website.pages.dev";
const canonicalOrigin = "https://despresine.ro";
const username = "preview";
const password = "private-preview";

function basicAuthorization(
  valueUsername = username,
  valuePassword = password,
) {
  return `Basic ${Buffer.from(`${valueUsername}:${valuePassword}`).toString("base64")}`;
}

function contactForm(overrides = {}) {
  const values = {
    availability: "După-amiaza, în timpul săptămânii",
    company: "",
    email: "persoana@example.com",
    meeting_format: "online",
    name: "  Ana Exemplu  ",
    ...overrides,
  };
  const formData = new FormData();

  for (const [key, value] of Object.entries(values)) {
    formData.set(key, String(value));
  }

  return formData;
}

function requestContext({
  authorization = basicAuthorization(),
  body,
  env = {},
  headers: requestHeaders = {},
  method = "GET",
  next = async () => new Response("static response"),
  origin,
  path = "/",
  requestOrigin = siteOrigin,
} = {}) {
  const headers = new Headers(requestHeaders);

  if (authorization) headers.set("Authorization", authorization);
  if (origin) headers.set("Origin", origin);

  return {
    env: {
      SITE_PASSWORD: password,
      SITE_PASSWORD_USER: username,
      ...env,
    },
    next,
    request: new Request(new URL(path, requestOrigin), {
      body,
      headers,
      method,
    }),
  };
}

function mockMailer(response = new Response(null, { status: 202 })) {
  const calls = [];

  return {
    calls,
    binding: {
      async fetch(input, init) {
        calls.push({ init, input: String(input) });
        return response;
      },
    },
  };
}

test("the www host redirects to the apex path before Basic Auth", async () => {
  let nextCalls = 0;
  const response = await onRequest(
    requestContext({
      authorization: null,
      next: async () => {
        nextCalls += 1;
        return new Response("must not be reached");
      },
      path: "/some/path",
      requestOrigin: "https://www.despresine.ro",
    }),
  );

  assert.equal(response.status, 308);
  assert.equal(
    response.headers.get("Location"),
    `${canonicalOrigin}/some/path`,
  );
  assert.equal(response.headers.get("WWW-Authenticate"), null);
  assert.equal(nextCalls, 0);
});

test("the production Pages fallback redirects to the canonical host", async () => {
  const response = await onRequest(
    requestContext({
      authorization: null,
      path: "/competente/?ref=fallback",
      requestOrigin: "https://silvia-dinu-website.pages.dev",
    }),
  );
  assert.equal(response.status, 308);
  assert.equal(
    response.headers.get("Location"),
    `${canonicalOrigin}/competente/?ref=fallback`,
  );
});

test("public pages and discovery files work without credentials or auth configuration", async () => {
  for (const path of [
    "/",
    "/robots.txt",
    "/sitemap-index.xml",
    "/competente/",
  ]) {
    const response = await onRequest(
      requestContext({
        authorization: null,
        env: { SITE_PASSWORD: undefined, SITE_PASSWORD_USER: undefined },
        next: async () =>
          new Response("public page", {
            headers: { "Cache-Control": "public, max-age=3600" },
          }),
        path,
        requestOrigin: canonicalOrigin,
      }),
    );
    assert.equal(response.status, 200, path);
    assert.equal(response.headers.get("WWW-Authenticate"), null, path);
    assert.equal(response.headers.get("X-Robots-Tag"), null, path);
    assert.equal(
      response.headers.get("Cache-Control"),
      "public, max-age=3600",
      path,
    );
  }
});

test("public page redirects preserve queries without requiring authentication", async () => {
  const response = await onRequest(
    requestContext({
      authorization: null,
      path: "/contact?ref=search",
      requestOrigin: canonicalOrigin,
    }),
  );
  assert.equal(response.status, 308);
  assert.equal(
    response.headers.get("Location"),
    `${canonicalOrigin}/contact/?ref=search`,
  );
});

test("versioned public assets keep their content and gain immutable caching", async () => {
  for (const [method, status] of [
    ["GET", 200],
    ["HEAD", 200],
    ["GET", 304],
  ]) {
    const body = status === 304 ? null : "asset content";
    const response = await onRequest(
      requestContext({
        authorization: null,
        method,
        next: async () =>
          new Response(body, {
            status,
            headers: {
              "Cache-Control": "public, max-age=0, must-revalidate",
              "Content-Type": "text/css",
              ETag: '"asset-version"',
            },
          }),
        path: "/_astro/index.DVMZL9EN.css?v=1",
        requestOrigin: canonicalOrigin,
      }),
    );
    assert.equal(response.status, status);
    assert.equal(
      response.headers.get("Cache-Control"),
      "public, max-age=31536000, immutable",
    );
    assert.equal(response.headers.get("Content-Type"), "text/css");
    assert.equal(response.headers.get("ETag"), '"asset-version"');
    assert.equal(await response.text(), body ?? "");
  }
});

test("fresh files, missing assets, and non-read requests do not gain immutable caching", async () => {
  for (const { path, status = 200, method = "GET" } of [
    { path: "/" },
    { path: "/robots.txt" },
    { path: "/sitemap-index.xml" },
    { path: "/sitemap-0.xml" },
    { path: "/_astro/unversioned.css" },
    { path: "/images/social.DVMZL9EN.jpg" },
    { path: "/_astro/missing.DVMZL9EN.css", status: 404 },
    { path: "/_astro/index.DVMZL9EN.css", method: "POST" },
  ]) {
    const response = await onRequest(
      requestContext({
        authorization: null,
        method,
        next: async () =>
          new Response("original response", {
            status,
            headers: { "Cache-Control": "public, max-age=0, must-revalidate" },
          }),
        path,
        requestOrigin: canonicalOrigin,
      }),
    );
    assert.equal(response.status, status, path);
    assert.equal(
      response.headers.get("Cache-Control"),
      "public, max-age=0, must-revalidate",
      path,
    );
  }
});

test("versioned preview assets remain protected and never publicly cached", async () => {
  const path = "/_astro/index.DVMZL9EN.css";
  const unauthorizedResponse = await onRequest(
    requestContext({ authorization: null, path }),
  );
  assert.equal(unauthorizedResponse.status, 401);
  assert.equal(unauthorizedResponse.headers.get("Cache-Control"), "no-store");

  const authorizedResponse = await onRequest(
    requestContext({
      next: async () =>
        new Response("preview asset", {
          headers: { "Cache-Control": "public, max-age=0, must-revalidate" },
        }),
      path,
    }),
  );
  assert.equal(authorizedResponse.status, 200);
  assert.equal(
    authorizedResponse.headers.get("Cache-Control"),
    "private, no-store",
  );
  assert.equal(
    authorizedResponse.headers.get("X-Robots-Tag"),
    "noindex, nofollow",
  );
});

test("preview access fails closed without password configuration", async () => {
  const response = await onRequest(
    requestContext({
      env: { SITE_PASSWORD: undefined, SITE_PASSWORD_USER: undefined },
    }),
  );
  assert.equal(response.status, 503);
});

test("the legacy competencies path redirects permanently before Basic Auth", async () => {
  let nextCalls = 0;
  const response = await onRequest(
    requestContext({
      authorization: null,
      next: async () => {
        nextCalls += 1;
        return new Response("must not be reached");
      },
      path: "/despre-silvia/?ref=legacy",
    }),
  );

  assert.equal(response.status, 308);
  assert.equal(
    response.headers.get("Location"),
    `${siteOrigin}/competente/?ref=legacy`,
  );
  assert.equal(response.headers.get("WWW-Authenticate"), null);
  assert.equal(nextCalls, 0);
});

test("the Pages function preserves the Basic Auth challenge", async () => {
  let nextCalls = 0;
  const response = await onRequest(
    requestContext({
      authorization: null,
      next: async () => {
        nextCalls += 1;
        return new Response("must not be reached");
      },
    }),
  );

  assert.equal(response.status, 401);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.match(response.headers.get("WWW-Authenticate") ?? "", /^Basic /);
  assert.equal(nextCalls, 0);
});

test("canonical trailing-slash redirects remain behind Basic Auth", async () => {
  let nextCalls = 0;
  const response = await onRequest(
    requestContext({
      authorization: null,
      next: async () => {
        nextCalls += 1;
        return new Response("must not be reached");
      },
      path: "/competente?qa=1",
    }),
  );

  assert.equal(response.status, 401);
  assert.equal(response.headers.get("Location"), null);
  assert.equal(nextCalls, 0);
});

test("authorized page requests gain a canonical trailing slash", async () => {
  for (const { method, path, expectedLocation } of [
    {
      expectedLocation: `${siteOrigin}/competente/?qa=1`,
      method: "GET",
      path: "/competente?qa=1",
    },
    {
      expectedLocation: `${siteOrigin}/blog/`,
      method: "HEAD",
      path: "/blog",
    },
  ]) {
    let nextCalls = 0;
    const response = await onRequest(
      requestContext({
        method,
        next: async () => {
          nextCalls += 1;
          return new Response("must not be reached");
        },
        path,
      }),
    );

    assert.equal(response.status, 308);
    assert.equal(response.headers.get("Location"), expectedLocation);
    assert.equal(nextCalls, 0);
  }
});

test("API, internal, and asset paths are not slash-normalized", async () => {
  for (const path of [
    "/api/health",
    "/_astro/entry",
    "/cdn-cgi/trace",
    "/favicon.svg",
  ]) {
    let nextCalls = 0;
    const response = await onRequest(
      requestContext({
        next: async () => {
          nextCalls += 1;
          return new Response(null, { status: 204 });
        },
        path,
      }),
    );

    assert.equal(response.status, 204, path);
    assert.equal(response.headers.get("Location"), null, path);
    assert.equal(nextCalls, 1, path);
  }
});

test("removed admin paths remain behind the site authentication gate", async () => {
  let nextCalls = 0;
  const response = await onRequest(
    requestContext({
      authorization: null,
      next: async () => {
        nextCalls += 1;
        return new Response("must not be reached");
      },
      path: "/admin",
    }),
  );

  assert.equal(response.status, 401);
  assert.match(response.headers.get("WWW-Authenticate") ?? "", /^Basic /);
  assert.equal(nextCalls, 0);
});

test("authorized static requests pass through without losing response details", async () => {
  let nextCalls = 0;
  const response = await onRequest(
    requestContext({
      next: async () => {
        nextCalls += 1;
        return new Response("protected asset", {
          headers: {
            "Cache-Control": "public, max-age=3600",
            "Content-Type": "text/plain; charset=utf-8",
            "X-Static-Response": "preserved",
          },
          status: 206,
        });
      },
      path: "/asset.txt",
    }),
  );

  assert.equal(nextCalls, 1);
  assert.equal(response.status, 206);
  assert.equal(await response.text(), "protected asset");
  assert.equal(
    response.headers.get("Content-Type"),
    "text/plain; charset=utf-8",
  );
  assert.equal(response.headers.get("X-Static-Response"), "preserved");
  assert.equal(response.headers.get("Cache-Control"), "private, no-store");
  assert.equal(response.headers.get("X-Robots-Tag"), "noindex, nofollow");
});

test("the public contact endpoint retains same-origin validation without Basic Auth", async () => {
  for (const origin of [canonicalOrigin, "https://example.net"]) {
    const mailer = mockMailer();
    const response = await onRequest(
      requestContext({
        authorization: null,
        body: contactForm(),
        env: { CONTACT_MAILER: mailer.binding },
        method: "POST",
        origin,
        path: "/api/contact",
        requestOrigin: canonicalOrigin,
      }),
    );
    const isSameOrigin = origin === canonicalOrigin;
    assert.equal(response.status, isSameOrigin ? 200 : 403);
    assert.equal(mailer.calls.length, isSameOrigin ? 1 : 0);
    assert.equal(response.headers.get("Cache-Control"), "no-store");
  }
});

test("an authorized same-origin contact request calls the mailer binding", async () => {
  const mailer = mockMailer();
  const response = await onRequest(
    requestContext({
      body: contactForm(),
      env: { CONTACT_MAILER: mailer.binding },
      method: "POST",
      origin: siteOrigin,
      path: "/api/contact",
    }),
  );

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.equal(mailer.calls.length, 1);

  const [{ init, input }] = mailer.calls;
  assert.equal(input, "https://contact-mailer.internal/send");
  assert.equal(init.method, "POST");
  assert.equal(init.headers["Content-Type"], "application/json");
  assert.deepEqual(JSON.parse(init.body), {
    availability: "După-amiaza, în timpul săptămânii",
    email: "persoana@example.com",
    meetingFormat: "online",
    name: "Ana Exemplu",
  });
});

test("an invalid contact email is rejected before the mailer is called", async () => {
  const mailer = mockMailer();
  const response = await onRequest(
    requestContext({
      body: contactForm({ email: "invalid-address" }),
      env: { CONTACT_MAILER: mailer.binding },
      method: "POST",
      origin: siteOrigin,
      path: "/api/contact",
    }),
  );

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { ok: false });
  assert.equal(mailer.calls.length, 0);
});

test("a contact request without a name is rejected before the mailer is called", async () => {
  const mailer = mockMailer();
  const response = await onRequest(
    requestContext({
      body: contactForm({ name: "   " }),
      env: { CONTACT_MAILER: mailer.binding },
      method: "POST",
      origin: siteOrigin,
      path: "/api/contact",
    }),
  );

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { ok: false });
  assert.equal(mailer.calls.length, 0);
});

test("an opted-in reflection summary is forwarded to the mailer", async () => {
  const reflectionResult = [
    "Rezultat al reflecției ghidate — DespreSine",
    "Stările emoționale au apărut mai des.",
    "Stări emoționale: 4 din 8",
  ].join("\n");
  const mailer = mockMailer();
  const response = await onRequest(
    requestContext({
      body: contactForm({ reflection_result: reflectionResult }),
      env: { CONTACT_MAILER: mailer.binding },
      method: "POST",
      origin: siteOrigin,
      path: "/api/contact",
    }),
  );

  assert.equal(response.status, 200);
  assert.equal(mailer.calls.length, 1);
  assert.equal(
    JSON.parse(mailer.calls[0].init.body).reflectionResult.replaceAll(
      "\r\n",
      "\n",
    ),
    reflectionResult,
  );
});

test("an oversized reflection summary is rejected before the mailer is called", async () => {
  const mailer = mockMailer();
  const response = await onRequest(
    requestContext({
      body: contactForm({ reflection_result: "x".repeat(2_001) }),
      env: { CONTACT_MAILER: mailer.binding },
      method: "POST",
      origin: siteOrigin,
      path: "/api/contact",
    }),
  );

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { ok: false });
  assert.equal(mailer.calls.length, 0);
});

test("an oversized contact body is rejected when Content-Length is missing", async () => {
  const mailer = mockMailer();
  const body = new URLSearchParams({
    availability: "x".repeat(12_001),
    email: "persoana@example.com",
  });
  const response = await onRequest(
    requestContext({
      body,
      env: { CONTACT_MAILER: mailer.binding },
      method: "POST",
      origin: siteOrigin,
      path: "/api/contact",
    }),
  );

  assert.equal(response.status, 413);
  assert.deepEqual(await response.json(), { ok: false });
  assert.equal(mailer.calls.length, 0);
});

test("an invalid contact Content-Length is rejected", async () => {
  const mailer = mockMailer();
  const response = await onRequest(
    requestContext({
      body: new URLSearchParams({ email: "persoana@example.com" }),
      env: { CONTACT_MAILER: mailer.binding },
      headers: { "Content-Length": "invalid" },
      method: "POST",
      origin: siteOrigin,
      path: "/api/contact",
    }),
  );

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { ok: false });
  assert.equal(mailer.calls.length, 0);
});

test("an oversized declared contact body is rejected before parsing", async () => {
  const mailer = mockMailer();
  const response = await onRequest(
    requestContext({
      body: new URLSearchParams({ email: "persoana@example.com" }),
      env: { CONTACT_MAILER: mailer.binding },
      headers: { "Content-Length": "12001" },
      method: "POST",
      origin: siteOrigin,
      path: "/api/contact",
    }),
  );

  assert.equal(response.status, 413);
  assert.deepEqual(await response.json(), { ok: false });
  assert.equal(mailer.calls.length, 0);
});

test("actual contact body bytes override a false-small Content-Length", async () => {
  const mailer = mockMailer();
  const response = await onRequest(
    requestContext({
      body: new URLSearchParams({
        availability: "x".repeat(12_001),
        email: "persoana@example.com",
      }),
      env: { CONTACT_MAILER: mailer.binding },
      headers: { "Content-Length": "1" },
      method: "POST",
      origin: siteOrigin,
      path: "/api/contact",
    }),
  );

  assert.equal(response.status, 413);
  assert.deepEqual(await response.json(), { ok: false });
  assert.equal(mailer.calls.length, 0);
});

test("the honeypot returns a generic success without calling the mailer", async () => {
  const mailer = mockMailer();
  const response = await onRequest(
    requestContext({
      body: contactForm({ company: "Automated submission" }),
      env: { CONTACT_MAILER: mailer.binding },
      method: "POST",
      origin: siteOrigin,
      path: "/api/contact",
    }),
  );

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(mailer.calls.length, 0);
});

test("cross-origin contact requests are rejected", async () => {
  const mailer = mockMailer();
  const response = await onRequest(
    requestContext({
      body: contactForm(),
      env: { CONTACT_MAILER: mailer.binding },
      method: "POST",
      origin: "https://example.net",
      path: "/api/contact",
    }),
  );

  assert.equal(response.status, 403);
  assert.deepEqual(await response.json(), { ok: false });
  assert.equal(mailer.calls.length, 0);
});

test("a valid contact request fails closed when the mailer binding is missing", async () => {
  const response = await onRequest(
    requestContext({
      body: contactForm(),
      method: "POST",
      origin: siteOrigin,
      path: "/api/contact",
    }),
  );

  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { ok: false });
  assert.equal(response.headers.get("Cache-Control"), "no-store");
});

test("Google verification uses the extensionless asset without redirecting", async () => {
  for (const path of [
    "/google21b3f224fa7179c8.html?proof=1",
    "/google21b3f224fa7179c8?proof=1",
  ]) {
    let assetRequest;
    const response = await onRequest(
      requestContext({
        authorization: null,
        requestOrigin: canonicalOrigin,
        path,
        next: async (request) => {
          assetRequest = request;
          // Simulate Pages serving only the extensionless URL directly.
          assert.equal(
            new URL(request.url).pathname,
            "/google21b3f224fa7179c8",
          );
          return new Response(
            "google-site-verification: google21b3f224fa7179c8.html",
          );
        },
      }),
    );
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("Location"), null);
    assert.equal(new URL(assetRequest.url).search, "?proof=1");
    assert.equal(
      await response.text(),
      "google-site-verification: google21b3f224fa7179c8.html",
    );
  }
});

test("Google verification remains password-protected on previews", async () => {
  let nextCalls = 0;
  const response = await onRequest(
    requestContext({
      authorization: null,
      path: "/google21b3f224fa7179c8.html",
      next: async () => {
        nextCalls += 1;
        return new Response("must not be reached");
      },
    }),
  );
  assert.equal(response.status, 401);
  assert.equal(nextCalls, 0);
});
