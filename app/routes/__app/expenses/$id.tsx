import { Expense } from "@prisma/client";
import { ActionArgs, json, MetaFunction, redirect } from "@remix-run/node";
import { useNavigate, useParams } from "@remix-run/react";
import ExpenseForm from "~/components/expenses/ExpenseForm";
import Modal from "~/components/util/Modal";
import { deleteExpense, updateExpense } from "~/data/expenses.server";
import { validateExpenseInput } from "~/data/validation.server";
import { ExpenseInput, ExpenseInputError } from "~/types";
// import { getExpense } from "~/data/expenses.server";

export default function ExpensesDetailPage() {
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

export async function action({ request, params }: ActionArgs) {
  const { id } = params as { id: string };
  if (request.method === "PATCH") {
    const formData = await request.formData();
    const expense = Object.fromEntries(formData) as unknown as ExpenseInput;
    try {
      validateExpenseInput(expense);
    } catch (e) {
      const error = e as ExpenseInputError;
      return error;
    }
    await updateExpense(id, {
      ...expense,
    });
    return redirect("/expenses");
  }
  if (request.method === "DELETE") {
    return await deleteExpense(id);
    //return redirect("/expenses");
  }
  throw json(
    { message: "Not Supported" },
    { status: 501, statusText: "Not Implemented" }
  );
}

export const meta: MetaFunction = ({ params, parentsData }) => {
  const expense = (parentsData["routes/__app/expenses"] as Expense[]).find(
    (expense) => expense.id === params.id
  );
  return {
    title: expense?.title,
    desctiption: "Manage you expenses with ease",
  };
};

// export async function loader({ params }: LoaderArgs) {
//   const { id } = params as { id: string };
//   console.log(`expenses/${id} loader`);
//   const selectedExpense = await getExpense(id);
//   return selectedExpense;
// }
