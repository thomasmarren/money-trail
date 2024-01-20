import { DateRangePickerValue } from "@tremor/react";
import { useState, useMemo } from "react";
import { TAccount } from "../../../../models/account";
import { TTransaction } from "../../../../models/transaction";
import { TTransactionType } from "../../../../models/transaction-type";
import { get } from "../../../utils/nodash";
import { useApiGet } from "../../../hooks/useApiGet";

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

  const all = useMemo(() => {
    if (!allTransactions) return [];

    return allTransactions.filter((transaction) => {
      if (!range.to || !range.from) return false;

      const date = new Date(transaction.date);
      if (date < range.from || date > range.to) return false;

      if (filters.length > 0) {
        const doesntMatchFilter = !filters.some((filter) => {
          const [method, value] = filter.split(":");

          return value === get(transaction, method);
        });

        if (doesntMatchFilter) return false;
      }
      return true;
    });
  }, [range, allTransactions, filters]);

  return {
    all,
    refetch,
    range,
    setRange,
    filters,
    setFilters,
  };
};
