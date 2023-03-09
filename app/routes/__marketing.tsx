import { HeadersFunction, LinksFunction, LoaderArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import MainHeader from "~/components/navigation/MainHeader";
import { getUserFromSession } from "~/data/auth.server";

import marketingStyles from "~/styles/marketing.css";

export default function MarketingLayout() {
  return (
    <>
      <MainHeader />
      <Outlet />
    </>
  );
}

export function loader({ request }: LoaderArgs) {
  return getUserFromSession(request);
}

export const headers: HeadersFunction = () => ({
  "Cache-Control": "max-age=3600",
});

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: marketingStyles },
];
