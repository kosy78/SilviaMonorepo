(function () {
  var currentScript = document.currentScript;
  var measurementId =
    currentScript && currentScript.getAttribute("data-ga-measurement-id");

  if (!measurementId) {
    return;
  }

  var consentKey = "silvia.analyticsConsent";
  var accepted = "accepted";
  var rejected = "rejected";
  var currentConsent = getStoredConsent();
  var panel = document.querySelector("[data-analytics-consent]");
  var settingsButton = document.querySelector("[data-analytics-settings]");
  var acceptButton = document.querySelector("[data-analytics-accept]");
  var rejectButton = document.querySelector("[data-analytics-reject]");

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments);
    };

  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
  });
  window.gtag("set", "ads_data_redaction", true);
  window.gtag("set", "allow_google_signals", false);
  window.gtag("set", "allow_ad_personalization_signals", false);

  function getStoredConsent() {
    try {
      var value = window.localStorage.getItem(consentKey);
      return value === accepted || value === rejected ? value : null;
    } catch (error) {
      return null;
    }
  }

  function storeConsent(value) {
    currentConsent = value;

    try {
      window.localStorage.setItem(consentKey, value);
    } catch (error) {
      // If storage is blocked, honor the choice for this page load.
    }
  }

  function sanitizeUrl(value) {
    if (!value) {
      return undefined;
    }

    try {
      var url = new URL(value, window.location.origin);
      return url.origin + url.pathname;
    } catch (error) {
      return undefined;
    }
  }

  function updateConsent(value) {
    window.gtag("consent", "update", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: value === accepted ? "granted" : "denied",
    });
  }

  function loadGoogleAnalytics() {
    window["ga-disable-" + measurementId] = false;
    updateConsent(accepted);

    if (window.__silviaGoogleAnalyticsLoaded) {
      return;
    }

    window.__silviaGoogleAnalyticsLoaded = true;
    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_expires: 15552000,
      cookie_flags: "SameSite=Lax;Secure",
      cookie_update: false,
      page_location: sanitizeUrl(window.location.href),
      page_referrer: sanitizeUrl(document.referrer),
      page_title: document.title,
    });

    var tag = document.createElement("script");
    tag.async = true;
    tag.src =
      "https://www.googletagmanager.com/gtag/js?id=" +
      encodeURIComponent(measurementId);
    document.head.appendChild(tag);
  }

  function disableGoogleAnalytics() {
    window["ga-disable-" + measurementId] = true;
    updateConsent(rejected);
  }

  function showPanel() {
    if (panel) {
      panel.hidden = false;
    }

    if (settingsButton) {
      settingsButton.hidden = true;
    }
  }

  function hidePanel() {
    if (panel) {
      panel.hidden = true;
    }

    if (settingsButton) {
      settingsButton.hidden = false;
    }
  }

  function syncConsentState() {
    if (currentConsent === accepted) {
      loadGoogleAnalytics();
      hidePanel();
      return;
    }

    if (currentConsent === rejected) {
      disableGoogleAnalytics();
      hidePanel();
      return;
    }

    disableGoogleAnalytics();
    showPanel();
  }

  function trackContactEmailClick(event) {
    if (currentConsent !== accepted || typeof window.gtag !== "function") {
      return;
    }

    var target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    var link = target.closest('a[href^="mailto:silvia.drn@gmail.com"]');
    if (!link) {
      return;
    }

    window.gtag("event", "contact_email_clicked", {
      contact_method: "email",
      link_context: link.getAttribute("data-analytics-context") || "email_link",
    });
  }

  if (acceptButton) {
    acceptButton.addEventListener("click", function () {
      storeConsent(accepted);
      loadGoogleAnalytics();
      hidePanel();
    });
  }

  if (rejectButton) {
    rejectButton.addEventListener("click", function () {
      storeConsent(rejected);
      disableGoogleAnalytics();
      hidePanel();
    });
  }

  if (settingsButton) {
    settingsButton.addEventListener("click", showPanel);
  }

  document.addEventListener("click", trackContactEmailClick);
  syncConsentState();
})();
