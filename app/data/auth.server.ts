import { UserInput } from "~/types";
import { prisma } from "./prisma.server";
import { hash, compare } from "bcryptjs";
import { createCookieSessionStorage, redirect } from "@remix-run/node";

class CommonError extends Error {
  public status: number = 200;
}

type SessionData = {
  userId: string;
};

type SessionFlashData = {
  error: string;
};

const SESSION_SECRET = process.env.SESSION_SECRET ?? "";

const cookieSessionStorage = createCookieSessionStorage<
  SessionData,
  SessionFlashData
>({
  cookie: {
    secure: process.env.NODE_ENV === "production",
    secrets: [SESSION_SECRET],
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60,
    httpOnly: true,
  },
});

async function createUserSession(userId: string, redirectPath: string) {
  const session = await cookieSessionStorage.getSession();
  session.set("userId", userId);
  return redirect(redirectPath, {
    headers: {
      "Set-Cookie": await cookieSessionStorage.commitSession(session),
    },
  });
}

export async function destorUserSession(request: Request) {
  const session = await cookieSessionStorage.getSession(
    request.headers.get("Cookie")
  );
  return redirect("/", {
    headers: {
      "Set-Cookie": await cookieSessionStorage.destroySession(session),
    },
  });
}

export async function requireUserSession(request: Request) {
  const userId = await getUserFromSession(request);
  if (!userId) {
    throw redirect("/auth?mode=login");
  }
  return userId;
}

export async function getUserFromSession(request: Request) {
  const session = await cookieSessionStorage.getSession(
    request.headers.get("Cookie")
  );

  const userId = session.get("userId");
  if (!userId) {
    return null;
  }

  return userId;
}

export async function signup({ email, password }: UserInput) {
  const existingUser = await prisma.user.findFirst({ where: { email } });
  if (existingUser) {
    const error = new CommonError(
      "A user with provided email address exists already."
    );
    error.status = 422;
    throw error;
  }

  const passwordHash = await hash(password, 12);

  const user = await prisma.user.create({
    data: { email, password: passwordHash },
  });
  return createUserSession(user.id, "/expenses");
}

export async function login({ email, password }: UserInput) {
  const existingUser = await prisma.user.findFirst({ where: { email } });
  if (!existingUser) {
    const error = new CommonError(
      "Could not log you in please check credentials"
    );
    error.status = 401;
    throw error;
  }

  const passwordCorrect = await compare(password, existingUser.password);

  if (!passwordCorrect) {
    const error = new CommonError(
      "Could not log you in please check credentials"
    );
    error.status = 401;
    throw error;
  }

  return createUserSession(existingUser.id, "/expenses");
}
