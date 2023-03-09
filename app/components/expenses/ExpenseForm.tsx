import {
  Form,
  Link,
  useActionData,
  useMatches,
  useNavigation,
  useParams,
} from "@remix-run/react";
import { Expense, ExpenseInput } from "~/types";

export default function ExpenseForm() {
  const today = new Date().toISOString().slice(0, 10); // yields something like 2023-09-10
  const validationErrors = useActionData();
  const navigation = useNavigation();

  //const selectedExpense: Expense | undefined = useLoaderData();
  const matches = useMatches();
  const { id } = useParams() as { id: string };

  const expenses: Expense[] =
    matches.find((match) => match.pathname === "/expenses")?.data ?? [];

  const selectedExpense = expenses.find((exp) => exp.id === id);

  if (id && !selectedExpense) {
    return <p>Invalid expense id</p>;
  }

  const defaultValues: ExpenseInput = selectedExpense
    ? {
        title: selectedExpense.title,
        amount: selectedExpense.amount.toString(),
        date: selectedExpense.date,
      }
    : { title: "", amount: "", date: "" };

  const isSubmitting = navigation.state !== "idle";

  return (
    <Form method={id ? "patch" : "post"} className="form" id="expense-form">
      <p>
        <label htmlFor="title">Expense Title</label>
        <input
          type="text"
          id="title"
          name="title"
          required
          maxLength={30}
          defaultValue={defaultValues.title}
        />
      </p>

      <div className="form-row">
        <p>
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            min="0"
            step="0.01"
            required
            defaultValue={defaultValues.amount}
          />
        </p>
        <p>
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            max={today}
            required
            defaultValue={
              defaultValues.date ? defaultValues.date.slice(0, 10) : ""
            }
          />
        </p>
      </div>
      {validationErrors ? (
        <ul>
          {Object.values<string>(validationErrors).map((err) => (
            <li key={err}>{err}</li>
          ))}
        </ul>
      ) : null}
      <div className="form-actions">
        <button disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Expense"}
        </button>
        <Link to="..">Cancel</Link>
      </div>
    </Form>
  );
}
