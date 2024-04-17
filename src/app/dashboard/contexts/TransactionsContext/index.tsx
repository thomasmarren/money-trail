import { QueryObserverResult } from "@tanstack/react-query";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
} from "react";
import { TTransaction } from "../../../../models/transaction";
import { useTransactions } from "./useTransactions";

export const TransactionsContext = createContext({
  transactions: [] as TTransaction[],
  refetch: async () => ({} as QueryObserverResult),
  range: {
    from: new Date(),
    to: new Date(),
  } as { from: Date; to: Date },
  setRange: (() => {}) as Dispatch<SetStateAction<{ from?: Date; to?: Date }>>,
  filters: [] as string[],
  setFilters: (() => []) as Dispatch<SetStateAction<string[]>>,
});

export const TransactionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { all, refetch, range, setRange, filters, setFilters } =
    useTransactions();

  const value = useMemo(
    () => ({
      filters,
      range,
      refetch,
      setFilters,
      setRange,
      transactions: all,
    }),
    [all, refetch, range, setRange, filters, setFilters]
  );

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactionContext = () => {
  return useContext(TransactionsContext);
};
