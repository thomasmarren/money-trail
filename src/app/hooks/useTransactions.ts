import { DateRangePickerValue } from "@tremor/react";
import { useState, useMemo } from "react";
import { TAccount } from "../../models/account";
import { TTransaction } from "../../models/transaction";
import { TTransactionType } from "../../models/transaction-type";
import { useApiGet } from "./useApiGet";

export const useTransactions = () => {
  const [filters, setFilters] = useState<string[]>([]);
  const [range, setRange] = useState<DateRangePickerValue>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  });

  const { data: allTransactions, refetch } = useApiGet<
    (TTransaction & {
      account: TAccount;
      type: TTransactionType;
    })[]
  >("/api/transactions");

  const [posted, pending] = useMemo(() => {
    if (!allTransactions) return [[], []];

    const posted: typeof allTransactions = [];
    const pending: typeof allTransactions = [];

    allTransactions.forEach((transaction) => {
      if (!range.to || !range.from) return;

      const date = new Date(transaction.date);
      if (date < range.from || date > range.to) return;

      if (filters.length > 0 && !filters.includes(transaction.type.id)) {
        return;
      }

      if (transaction.payload["Is Pending"] === "Yes") {
        pending.push(transaction);
      } else {
        posted.push(transaction);
      }
    });

    return [posted, pending];
  }, [range, allTransactions, filters]);

  return {
    all: [...posted, ...pending],
    posted,
    pending,
    refetch,
    range,
    setRange,
    filters,
    setFilters,
  };
};
