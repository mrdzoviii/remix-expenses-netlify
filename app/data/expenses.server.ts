import { prisma } from "~/data/prisma.server";
import { ExpenseInput } from "~/types";

export async function addExpense(expense: ExpenseInput, userId: string) {
  try {
    return await prisma.expense.create({
      data: {
        title: expense.title,
        amount: +expense.amount,
        date: new Date(expense.date),
        User: { connect: { id: userId } },
      },
    });
  } catch (error) {
    throw new Error("Failed to add expense.");
  }
}

export async function getExpenses(userId: string) {
  if (!userId) {
    throw new Error("Failed to fetch expenses");
  }
  try {
    return await prisma.expense.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });
  } catch (e) {
    throw new Error("Failed to fetch expenses.");
  }
}

export async function getExpense(id: string) {
  try {
    return await prisma.expense.findFirst({ where: { id } });
  } catch (e) {
    throw new Error("Failed to get expense.");
  }
}

export async function updateExpense(id: string, data: ExpenseInput) {
  try {
    return await prisma.expense.update({
      where: { id },
      data: {
        title: data.title,
        amount: +data.amount,
        date: new Date(data.date),
      },
    });
  } catch (e) {
    throw new Error("Failed to update expense.");
  }
}

export async function deleteExpense(id: string) {
  try {
    return await prisma.expense.delete({
      where: { id },
    });
  } catch (e) {
    throw new Error("Failed to delete expense.");
  }
}
