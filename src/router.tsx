import {
  createHashHistory,
  createRouter,
  createBrowserHistory,
} from "@tanstack/react-router";
import { AppErrorComponent } from "@/lib/error-component";
import { routeTree } from "./routeTree.gen";

/**
 * The Android build is a fully local Capacitor SPA. Hash history is intentional
 * there: a route such as /learn/day-1 must never require the WebView's local
 * asset server to resolve a second HTML document after a reload/deep-link.
 *
 * The normal web build keeps browser history and clean URLs.
 */
export function getRouter() {
  const isMobile = import.meta.env.MODE === "mobile";
  const history = isMobile ? createHashHistory() : createBrowserHistory();

  return createRouter({
    routeTree,
    history,
    defaultErrorComponent: AppErrorComponent,
  });
}
