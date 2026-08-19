"use client";

import { useEffect } from 'react';

/**
 * Unregisters any previously-registered service workers (e.g. the old /sw.js
 * PWA service worker) so the browser stops requesting them from the server.
 */
const ServiceWorkerCleanup = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.getRegistrations()
      .then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister().then((success) => {
            console.log(`[ServiceWorkerCleanup] Unregistered SW (${registration.scope}): ${success}`);
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