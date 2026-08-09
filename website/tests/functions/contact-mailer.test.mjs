import assert from "node:assert/strict";
import test from "node:test";

import contactMailer from "../../workers/contact-mailer.js";

function contactRequest(overrides = {}) {
  return new Request("https://contact-mailer.internal/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      availability: "Miercuri dimineața",
      email: "persoana@example.com",
      meetingFormat: "online",
      name: "Ana Exemplu",
      ...overrides,
    }),
  });
}

function emailBinding() {
  const messages = [];

  return {
    binding: {
      async send(message) {
        messages.push(message);
      },
    },
    messages,
  };
}

test("the mailer includes an opted-in reflection summary in the email", async () => {
  const reflectionResult = [
    "Rezultat al reflecției ghidate — DespreSine",
    "Stările emoționale au apărut mai des.",
    "Stări emoționale: 5 din 10",
  ].join("\n");
  const email = emailBinding();
  const response = await contactMailer.fetch(
    contactRequest({ reflectionResult }),
    { EMAIL: email.binding },
  );

  assert.equal(response.status, 200);
  assert.equal(email.messages.length, 1);
  assert.match(email.messages[0].text, /Rezultat opțional al reflecției:/);
  assert.match(email.messages[0].text, /Stări emoționale: 5 din 10/);
});

test("the mailer omits the reflection section when no result was included", async () => {
  const email = emailBinding();
  const response = await contactMailer.fetch(contactRequest(), {
    EMAIL: email.binding,
  });

  assert.equal(response.status, 200);
  assert.equal(email.messages.length, 1);
  assert.doesNotMatch(email.messages[0].text, /Rezultat opțional/);
});
