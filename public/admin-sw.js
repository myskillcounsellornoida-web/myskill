/* Service worker for the installable admin panel. Handles Web Push only —
   it deliberately does not cache, so the admin always sees live data. */

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: "My Skill Counsellor", body: event.data ? event.data.text() : "" };
  }

  const title = data.title || "My Skill Counsellor";
  event.waitUntil(
    self.registration.showNotification(title, {
      body: data.body || "",
      tag: data.tag || "msc-admin",
      data: { url: data.url || "/admin" },
      icon: "/images/logo.png",
      badge: "/images/logo.png",
      renotify: true,
      requireInteraction: true,
      timestamp: data.at || Date.now(),
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || "/admin";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes("/admin") && "focus" in client) {
          client.navigate(target).catch(() => {});
          return client.focus();
        }
      }
      return self.clients.openWindow(target);
    })
  );
});
