import { HeadersFunction, json, LoaderArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { FaPlus, FaDownload } from "react-icons/fa";
import ExpensesList from "~/components/expenses/ExpensesList";
import { requireUserSession } from "~/data/auth.server";
import { getExpenses } from "~/data/expenses.server";

import { Expense } from "~/types";

export default function ExpensesLayout() {
  const expenses: Expense[] = useLoaderData();
  const hasExpenses = expenses && expenses.length > 0;
  return (
    <>
      <Outlet />
      <main>
        <section id="expenses-actions">
          <Link to="add">
            <FaPlus />
            <span>Add Expense</span>
          </Link>
          <a href="/expenses/raw">
            <FaDownload />
            <span>Load Raw Data</span>
          </a>
        </section>
        {hasExpenses ? (
          <ExpensesList expenses={expenses} />
        ) : (
          <section id="no-expenses">
            <h1>No expenses found</h1>
            <p>
              Start <Link to="add">adding some</Link> today.
            </p>
          </section>
        )}
      </main>
    </>
  );
}

// export const CatchBoundary: CatchBoundaryComponent = () => {
//   return <p>No expenses</p>;
// };

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserSession(request);
  const expenses = await getExpenses(userId);
  // if (!expenses || expenses.length === 0) {
  //   throw json(
  //     { message: "Could not find any expense" },
  //     { status: 404, statusText: "Not expenses found" }
  //   );
  // }
  return json(expenses, { headers: { "Cache-Control": "max-age=3" } });
}

export const headers: HeadersFunction = ({ loaderHeaders }) => ({
  "Cache-Control": loaderHeaders.get("Cache-Control") ?? "max-age=3600",
});
