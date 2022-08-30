import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../lib/axios";

interface transaction {
  id: number;
  description: string;
  type: "income" | "outcome";
  price: number;
  category: string;
  createdAt: string;
}

interface CreateTransactionInput {
  description: string;
  type: "income" | "outcome";
  price: number;
  category: string;
}

interface TransactionContextType {
  transactions: transaction[];
  fetchTransactions: (query?: string) => Promise<void>;
  createtransaction: (data: CreateTransactionInput) => void;
}

interface TransactionProviderProps {
  children: ReactNode;
}

export const TransactionsContext = createContext({} as TransactionContextType);

export function TransactionProvider({ children }: TransactionProviderProps) {
  const [transactions, setTransactions] = useState<transaction[]>([]);

  async function fetchTransactions(query?: string) {
    const response = await api.get("transactions", {
      params: { _sort: "createdAt", _order: "desc", q: query },
    });

    setTransactions(response.data);
  }

  async function createtransaction(data: CreateTransactionInput) {
    const { description, price, category, type } = data;

    const response = await api.post("transactions", {
      description,
      price,
      category,
      type,
      createdAt: new Date(),
    });

    setTransactions((state) => [response.data, ...state]);
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <TransactionsContext.Provider
      value={{ transactions, fetchTransactions, createtransaction }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}
