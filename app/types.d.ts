export interface ExpenseInput {
  title: string;
  amount: string;
  date: string;
}

export interface UserInput {
  email: string;
  password: string;
}

export interface UserInputError {
  email?: string;
  password?: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
}

export interface ExpenseInputError {
  title?: string;
  amount?: string;
  date?: string;
}

export interface CommonError extends Error {
  status: number;
}
