const DESTINATION_EMAIL = "silvia.drn@gmail.com";
const SENDER_EMAIL = "contact@despresine.ro";

const formatLabels = {
  cabinet: "în cabinet",
  online: "online",
  nesigur: "format încă neclarificat",
};

function normalize(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function isValidEmail(value) {
  return (
    value.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) &&
    !/[\r\n]/.test(value)
  );
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (
      request.method !== "POST" ||
      url.hostname !== "contact-mailer.internal" ||
      url.pathname !== "/send"
    ) {
      return new Response("Not found", { status: 404 });
    }

    if (!env.EMAIL?.send) {
      return new Response("Email binding unavailable", { status: 503 });
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return new Response("Invalid request", { status: 400 });
    }

    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return new Response("Invalid request", { status: 400 });
    }

    const name = normalize(payload.name, 100);
    const email = normalize(payload.email, 254);
    const meetingFormat = normalize(payload.meetingFormat, 20);
    const availability = normalize(payload.availability, 400);

    if (
      !isValidEmail(email) ||
      !(Object.hasOwn(formatLabels, meetingFormat) || !meetingFormat)
    ) {
      return new Response("Invalid request", { status: 400 });
    }

    const text = [
      "Mesaj nou din formularul DespreSine",
      "",
      `Nume: ${name || "nespecificat"}`,
      `Email: ${email}`,
      `Format preferat: ${formatLabels[meetingFormat] || "nespecificat"}`,
      "",
      "Detalii practice:",
      availability || "nespecificate",
      "",
      "Mesajul a fost transmis fără stocare într-o bază de date a website-ului.",
    ].join("\n");

    try {
      await env.EMAIL.send({
        from: { email: SENDER_EMAIL, name: "DespreSine" },
        to: DESTINATION_EMAIL,
        replyTo: email,
        subject: "Solicitare nouă prin despresine.ro",
        text,
      });
    } catch {
      return new Response("Delivery failed", { status: 502 });
    }

    return Response.json(
      { ok: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  },
};
