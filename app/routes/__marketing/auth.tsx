import { ActionArgs, LinksFunction, redirect } from "@remix-run/node";
import AuthForm from "~/components/auth/AuthForm";
import { login, signup } from "~/data/auth.server";
import { validateCredentials } from "~/data/validation.server";

import authStyles from "~/styles/auth.css";
import { CommonError, UserInput, UserInputError } from "~/types";

export default function AuthPage() {
  return <AuthForm />;
}

export async function action({ request }: ActionArgs) {
  const searchParams = new URL(request.url).searchParams;

  const authMode = searchParams.get("mode") ?? "login";

  const formData = await request.formData();
  const credentials = Object.fromEntries(formData) as unknown as UserInput;

  try {
    validateCredentials(credentials);
  } catch (e) {
    const error = e as UserInputError;
    return error;
  }

  try {
    if (authMode === "login") {
      return await login(credentials);
    } else {
      return await signup(credentials);
    }
  } catch (e) {
    const error = e as CommonError;
    console.log(e);
    if (error.status === 422 || error.status === 401) {
      return { credentials: error.message };
    }
  }
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: authStyles },
];
