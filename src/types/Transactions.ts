import type { Category, CategorySummary } from "./category";

export const TransactionType = {
  EXPENSE: "expense",
  INCOME: "income",
} as const;

export interface Transaction {
  id: string;
  UserId: string;
  description: string;
  amount: number;
  date: string | Date;
  categoryId: string;
  category: Category;
  type: TransactionType;
  updatedAt: string | Date;
  createdAt: string | Date;
}

export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType];

export interface TransactionFilter {
  month: number;
  year: number;
  categoryId?: string;
  type?: TransactionType;
}

export interface TransactionSummary {
  totalExpenses: number;
  totalIncomes: number;
  balance: number;
  expensesByCategory: CategorySummary[];
}
