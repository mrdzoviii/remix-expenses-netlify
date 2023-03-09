import { ActionArgs, redirect } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";

import ExpenseForm from "~/components/expenses/ExpenseForm";
import Modal from "~/components/util/Modal";
import { requireUserSession } from "~/data/auth.server";

import { addExpense } from "~/data/expenses.server";
import { validateExpenseInput } from "~/data/validation.server";
import { ExpenseInput, ExpenseInputError } from "~/types";

export async function action({ request }: ActionArgs) {
  const userId = await requireUserSession(request);
  const formData = await request.formData();
  const expense = Object.fromEntries(formData) as unknown as ExpenseInput;
  try {
    validateExpenseInput(expense);
  } catch (e) {
    const error = e as ExpenseInputError;
    return error;
  }
  await addExpense(
    {
      ...expense,
    },
    userId
  );
  return redirect("/expenses");
}

export default function ExpensesAddPage() {
  const navigate = useNavigate();
  return (
    <Modal
      onClose={() => {
        navigate("..");
      }}
    >
      <ExpenseForm />
    </Modal>
  );
}
