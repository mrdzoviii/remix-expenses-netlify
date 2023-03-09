import { json, LoaderArgs } from "@remix-run/node";
import { requireUserSession } from "~/data/auth.server";
import { getExpenses } from "~/data/expenses.server";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserSession(request);

  const expenses = await getExpenses(userId);
  if (!expenses || expenses.length === 0) {
    throw json(
      { message: "No expenses found" },
      { status: 404, statusText: "Not Found" }
    );
  }
  return expenses;
}
