import { json, LoaderArgs } from "@remix-run/node";
import {
  CatchBoundaryComponent,
  Link,
  useCatch,
  useLoaderData,
} from "@remix-run/react";
import Chart from "~/components/expenses/Chart";
import ExpenseStatistics from "~/components/expenses/ExpenseStatistics";
import Error from "~/components/util/Error";
import { requireUserSession } from "~/data/auth.server";
import { getExpenses } from "~/data/expenses.server";
import { Expense } from "~/types";

export default function ExpensesAnalysisPage() {
  const expenses = useLoaderData() as Expense[];
  return (
    <main>
      <Chart expenses={expenses} />
      <ExpenseStatistics expenses={expenses} />
    </main>
  );
}

export const CatchBoundary: CatchBoundaryComponent = () => {
  const caughtResponse = useCatch();
  return (
    <main>
      <Error title={caughtResponse.statusText}>
        <section id="no-expenses">
          <h1>No expenses found</h1>
          <p>
            Start <Link to="/expenses/add">adding some</Link> today.
          </p>
        </section>
      </Error>
    </main>
  );
};

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
