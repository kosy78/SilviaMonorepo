const AUTH_REALM = "DespreSine preview";
const WELL_KNOWN_PREFIX = "/.well-known/";

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

export async function onRequest(context) {
  const url = new URL(context.request.url);

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
    const response = await context.next();
    const protectedResponse = new Response(response.body, response);
    protectedResponse.headers.set("Cache-Control", "private, no-store");
    return protectedResponse;
  }

  return unauthorized();
}
