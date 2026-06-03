import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth } from "./router-DdjAxO3q.mjs";
import "../_libs/sonner.mjs";
import { a6 as User, a7 as CreditCard, Y as Bell, a8 as TriangleAlert } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
function SettingsOverview() {
  const {
    user
  } = useAuth();
  if (!user) return null;
  const cards = [{
    to: "/app/settings/profile",
    icon: User,
    title: "Profile",
    desc: "Name, bio, avatar, freelancer category"
  }, {
    to: "/app/settings/subscription",
    icon: CreditCard,
    title: "Subscription",
    desc: `Current plan: ${user.plan}`
  }, {
    to: "/app/settings/notifications",
    icon: Bell,
    title: "Notifications",
    desc: "Email alerts and weekly digest"
  }, {
    to: "/app/settings/danger-zone",
    icon: TriangleAlert,
    title: "Danger Zone",
    desc: "Export or delete your account"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2", children: cards.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: c.to, className: "group rounded-2xl border border-border bg-card p-5 transition hover:border-primary hover:shadow-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(c.icon, { className: "h-5 w-5" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-4 font-display text-lg font-semibold group-hover:text-primary", children: c.title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: c.desc })
  ] }, c.to)) });
}
export {
  SettingsOverview as component
};
