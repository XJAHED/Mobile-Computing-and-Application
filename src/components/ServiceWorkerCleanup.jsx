"use client";

import { useEffect } from 'react';

/**
 * Unregisters any previously-registered legacy service workers (e.g. the old
 * /sw.js PWA service worker) so the browser stops requesting them from the
 * server. This preserves the Firebase Cloud Messaging service worker
 * (firebase-messaging-sw.js) which is required for push notifications.
 */
const ServiceWorkerCleanup = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.getRegistrations()
      .then((registrations) => {
        registrations.forEach((registration) => {
          const scope = registration.scope || '';
          // Only unregister legacy /sw.js workers, never the FCM messaging worker
          if (scope.includes('/firebase-cloud-messaging-push-scope') ||
              scope.includes('firebase-messaging-sw.js')) {
            console.log(`[ServiceWorkerCleanup] Keeping FCM SW: ${scope}`);
            return;
          }
          registration.unregister().then((success) => {
            console.log(`[ServiceWorkerCleanup] Unregistered legacy SW (${scope}): ${success}`);
          });
        });
      })
      .catch((error) => {
        console.error('[ServiceWorkerCleanup] Failed to unregister service workers:', error);
      });
  }, []);

  return null;
};

export default ServiceWorkerCleanup;
