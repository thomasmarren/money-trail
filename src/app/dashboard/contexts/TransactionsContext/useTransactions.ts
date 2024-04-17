import { useState, useMemo } from "react";
import { TTransaction } from "../../../../models/transaction";
import { get } from "../../../utils/nodash";
import { useApiGet } from "../../../hooks/useApiGet";

export const useTransactions = ({
  defaultRange = {},
}: { defaultRange?: { from?: Date; to?: Date } } = {}) => {
  const [filters, setFilters] = useState<string[]>([]);
  const [range, setRange] = useState<{ from: Date; to: Date }>({
    from:
      defaultRange.from ||
      new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: defaultRange.to || new Date(),
  });

  const { data: allTransactions, refetch } =
    useApiGet<TTransaction[]>("/api/transactions");

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
