import handler from "vinext/server/fetch-handler";
import { runWithConnectorBinding } from "../lib/connector-context";
import type { ConnectorBinding } from "../lib/connector-contract.mjs";

const worker = {
  async fetch(request: Request, env: Cloudflare.Env, ctx: ExecutionContext<{ CONNECTORS?: ConnectorBinding }>) {
    let binding = ctx.props?.CONNECTORS;
    // Local preview emulates the same request-scoped capability. This branch and
    // the auxiliary service binding are absent from production builds.
    if (import.meta.env.DEV && !binding && env.CONNECTORS) {
      const preview = env.CONNECTORS;
      const expiresAt = Date.now() + 60_000;
      binding = {
        async getContext() {
          if (Date.now() >= expiresAt) return { status: "request_context_expired" };
          return preview.getContext?.() ?? { status: "binding_unavailable" };
        },
        async invoke(connectorId, actionName, args) {
          if (Date.now() >= expiresAt) {
            return { status: "request_context_expired", message: "This request has expired. Please try again." };
          }
          return preview.invoke(connectorId, actionName, args);
        },
      };
    }
    const url = new URL(request.url);
    const hashedAsset = /^(?:\/assets\/|\/_next\/static\/(?:chunks|css)\/)(?:[^/]+[.-])?[A-Za-z0-9_-]{8}\.(?:js|css)$/.test(url.pathname);
    const assets = (env as Cloudflare.Env & { ASSETS?: Fetcher }).ASSETS;
    const response = hashedAsset && assets && (request.method === "GET" || request.method === "HEAD")
      ? await assets.fetch(request)
      : await runWithConnectorBinding(binding,()=>handler.fetch(request,env,ctx));
    const secured=new Response(response.body,response);
    secured.headers.set("X-Content-Type-Options","nosniff");
    secured.headers.set("Referrer-Policy","strict-origin-when-cross-origin");
    secured.headers.set("X-Robots-Tag","noindex, follow");
    secured.headers.append("Content-Security-Policy", "base-uri 'self'; object-src 'none'; form-action 'self'; frame-ancestors 'self' https://chatgpt.com https://*.chatgpt.com");
    secured.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=()");
    if (url.protocol === "https:") secured.headers.set("Strict-Transport-Security", "max-age=31536000");
    // Only content-addressed build output is immutable. Product photos retain
    // their normal cache policy; private/API responses must never be cached here.
    if ((request.method === "GET" || request.method === "HEAD") && (secured.ok || secured.status === 304) && hashedAsset) {
      secured.headers.set("Cache-Control", "public, max-age=31536000, immutable");
    }
    return secured;
  },
};

export default worker;
