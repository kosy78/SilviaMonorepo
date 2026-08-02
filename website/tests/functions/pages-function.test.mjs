import assert from "node:assert/strict";
import test from "node:test";

import { onRequest } from "../../functions/[[path]].js";

const siteOrigin = "https://despresine.ro";
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
  assert.equal(response.headers.get("Location"), `${siteOrigin}/some/path`);
  assert.equal(response.headers.get("WWW-Authenticate"), null);
  assert.equal(nextCalls, 0);
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
