import ExpenseListItem from "~/components/expenses/ExpenseListItem";
import { Expense } from "~/types";

interface ExpensesListProps {
  expenses: Expense[];
}

export default function ExpensesList({ expenses }: ExpensesListProps) {
  return (
    <ol id="expenses-list">
      {expenses.map((expense) => (
        <li key={expense.id}>
          <ExpenseListItem
            id={expense.id}
            title={expense.title}
            amount={expense.amount}
          />
        </li>
      ))}
    </ol>
  );
}
