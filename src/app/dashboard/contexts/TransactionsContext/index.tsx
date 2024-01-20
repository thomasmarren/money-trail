import { QueryObserverResult } from "@tanstack/react-query";
import { DateRangePickerValue } from "@tremor/react";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
} from "react";
import { TAccount } from "../../../../models/account";
import { TTransaction } from "../../../../models/transaction";
import { TTransactionType } from "../../../../models/transaction-type";
import { useTransactions } from "./useTransactions";

export const TransactionsContext = createContext({
  transactions: [] as (TTransaction & {
    account: TAccount;
    type: TTransactionType;
  })[],
  refetch: async () => ({} as QueryObserverResult),
  range: {
    from: new Date(),
    to: new Date(),
  } as DateRangePickerValue,
  setRange: (() => {}) as Dispatch<SetStateAction<DateRangePickerValue>>,
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
