const AUTH_REALM = "DespreSine preview";
const WELL_KNOWN_PREFIX = "/.well-known/";
const CONTACT_PATH = "/api/contact";
const MAX_CONTACT_BODY_BYTES = 12_000;
const CONTACT_FORMATS = new Set(["", "cabinet", "online", "nesigur"]);

function unauthorized() {
  return new Response("Authentication required.", {
    status: 401,
    headers: {
      "Cache-Control": "no-store",
      "WWW-Authenticate": `Basic realm="${AUTH_REALM}", charset="UTF-8"`,
    },
  });
}

function unavailable() {
  return new Response("Password protection is not configured.", {
    status: 503,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

function parseBasicAuth(header) {
  if (!header || !header.startsWith("Basic ")) {
    return null;
  }

  try {
    const decoded = atob(header.slice("Basic ".length));
    const separator = decoded.indexOf(":");

    if (separator === -1) {
      return null;
    }

    return {
      username: decoded.slice(0, separator),
      password: decoded.slice(separator + 1),
    };
  } catch {
    return null;
  }
}

function constantTimeEqual(left, right) {
  if (left.length !== right.length) {
    return false;
  }

  let diff = 0;

  for (let index = 0; index < left.length; index += 1) {
    diff |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return diff === 0;
}

function jsonResponse(payload, status = 200) {
  return Response.json(payload, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

function normalizeField(value) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(value) {
  return (
    value.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) &&
    !/[\r\n]/.test(value)
  );
}

function isSameOrigin(request, url) {
  const origin = request.headers.get("Origin");

  if (!origin) {
    return false;
  }

  try {
    return new URL(origin).origin === url.origin;
  } catch {
    return false;
  }
}

async function readBodyWithinLimit(request, limit) {
  if (!request.body) {
    return new Uint8Array();
  }

  const reader = request.body.getReader();
  const chunks = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      totalBytes += value.byteLength;
      if (totalBytes > limit) {
        await reader.cancel();
        return null;
      }

      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;

  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return body;
}

async function handleContact(context, url) {
  const { request } = context;

  if (request.method !== "POST") {
    return new Response(null, {
      status: 405,
      headers: {
        Allow: "POST",
        "Cache-Control": "no-store",
      },
    });
  }

  if (!isSameOrigin(request, url)) {
    return jsonResponse({ ok: false }, 403);
  }

  const contentLengthHeader = request.headers.get("Content-Length");
  if (contentLengthHeader !== null) {
    const contentLength = Number(contentLengthHeader);

    if (!Number.isSafeInteger(contentLength) || contentLength < 0) {
      return jsonResponse({ ok: false }, 400);
    }

    if (contentLength > MAX_CONTACT_BODY_BYTES) {
      return jsonResponse({ ok: false }, 413);
    }
  }

  const contentType = request.headers.get("Content-Type") || "";
  if (
    !contentType.startsWith("multipart/form-data") &&
    !contentType.startsWith("application/x-www-form-urlencoded")
  ) {
    return jsonResponse({ ok: false }, 415);
  }

  let body;
  try {
    body = await readBodyWithinLimit(request, MAX_CONTACT_BODY_BYTES);
  } catch {
    return jsonResponse({ ok: false }, 400);
  }

  if (body === null) {
    return jsonResponse({ ok: false }, 413);
  }

  let formData;
  try {
    formData = await new Response(body, {
      headers: { "Content-Type": contentType },
    }).formData();
  } catch {
    return jsonResponse({ ok: false }, 400);
  }

  if ([...formData.values()].some((value) => typeof value !== "string")) {
    return jsonResponse({ ok: false }, 400);
  }

  const honeypot = normalizeField(formData.get("company"));
  if (honeypot) {
    return jsonResponse({ ok: true });
  }

  const name = normalizeField(formData.get("name"));
  const email = normalizeField(formData.get("email"));
  const meetingFormat = normalizeField(formData.get("meeting_format"));
  const availability = normalizeField(formData.get("availability"));

  if (
    name.length > 100 ||
    !isValidEmail(email) ||
    !CONTACT_FORMATS.has(meetingFormat) ||
    availability.length > 400
  ) {
    return jsonResponse({ ok: false }, 400);
  }

  if (!context.env.CONTACT_MAILER?.fetch) {
    return jsonResponse({ ok: false }, 503);
  }

  let mailResponse;
  try {
    mailResponse = await context.env.CONTACT_MAILER.fetch(
      "https://contact-mailer.internal/send",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, meetingFormat, availability }),
      },
    );
  } catch {
    return jsonResponse({ ok: false }, 502);
  }

  if (!mailResponse.ok) {
    return jsonResponse({ ok: false }, 502);
  }

  return jsonResponse({ ok: true });
}

export async function onRequest(context) {
  const url = new URL(context.request.url);

  if (url.hostname === "www.despresine.ro") {
    url.hostname = "despresine.ro";
    return Response.redirect(url.toString(), 308);
  }

  if (url.pathname.startsWith(WELL_KNOWN_PREFIX)) {
    return context.next();
  }

  const expectedUsername = context.env.SITE_PASSWORD_USER;
  const expectedPassword = context.env.SITE_PASSWORD;

  if (!expectedUsername || !expectedPassword) {
    return unavailable();
  }

  const credentials = parseBasicAuth(
    context.request.headers.get("Authorization"),
  );

  if (
    credentials &&
    constantTimeEqual(credentials.username, expectedUsername) &&
    constantTimeEqual(credentials.password, expectedPassword)
  ) {
    if (url.pathname === CONTACT_PATH) {
      return handleContact(context, url);
    }

    const response = await context.next();
    const protectedResponse = new Response(response.body, response);
    protectedResponse.headers.set("Cache-Control", "private, no-store");
    return protectedResponse;
  }

  return unauthorized();
}
