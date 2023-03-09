import type {
  ErrorBoundaryComponent,
  LinksFunction,
  MetaFunction,
} from "@remix-run/node";
import {
  CatchBoundaryComponent,
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useMatches,
} from "@remix-run/react";

import Error from "~/components/util/Error";

import sharedStyles from "~/styles/shared.css";

interface DocumentProps {
  title?: string;
  children: React.ReactNode | React.ReactNode[];
}

function Document({ title = "", children }: DocumentProps) {
  const matches = useMatches();
  console.log(matches);
  const disableJS = matches.some((match) => match.handle?.disableJS);
  return (
    <html lang="en">
      <head>
        {title ? <title>{title}</title> : null}
        <Meta />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        {!disableJS ? <Scripts /> : null}
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  const caughtResponse = useCatch();
  return (
    <Document title="An error occurred">
      <main>
        <Error title="An error occured">
          <p>{error.message || "Something went wrong. Please try again"}</p>
          <p>
            Back to <Link to="/">safety</Link>
          </p>
        </Error>
      </main>
    </Document>
  );
};

export const CatchBoundary: CatchBoundaryComponent = () => {
  const caughtResponse = useCatch();
  return (
    <Document title={caughtResponse.statusText}>
      <main>
        <Error title={caughtResponse.statusText}>
          <p>
            {caughtResponse.data?.message ||
              "Something went wrong. Please try again"}
          </p>
          <p>
            Back to <Link to="/">safety</Link>
          </p>
        </Error>
      </main>
    </Document>
  );
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "RemixExpenses",
  viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: sharedStyles,
  },
];
