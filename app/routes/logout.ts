import { ActionArgs, json } from "@remix-run/node";
import { destorUserSession } from "~/data/auth.server";

export async function action({ request }: ActionArgs) {
  if (request.method !== "POST") {
    throw json({ message: "Invalid request" }, { status: 400 });
  }

  return destorUserSession(request);
}
