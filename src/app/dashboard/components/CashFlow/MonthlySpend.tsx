import { AreaChart, Title } from "@tremor/react";
import { Card } from "antd";
import { useMemo } from "react";
import { TAccount } from "../../../../models/account";
import { useApiGet } from "../../../hooks/useApiGet";
import { CurrencyFormatter } from "../../../utils/currency-formatter";
import { useTransactionContext } from "../../contexts/TransactionsContext";
import { DateTime, Interval } from "luxon";
import { useTransactions } from "../../contexts/TransactionsContext/useTransactions";

export const MonthlySpend = () => {
  const { data } = useApiGet<TAccount[]>("/api/accounts");

  const { transactions, range } = useTransactionContext();
  const { from, to } = {
    from: new Date(range.from.getFullYear(), new Date().getMonth() - 1, 1),
    to: new Date(range.to.getFullYear(), new Date().getMonth() - 1, 31),
  };
  const { all: lastMonthTransactions } = useTransactions({
    defaultRange: { from, to },
  });

  const chartData = useMemo(() => {
    let datesObj: {
      [date: string]: {
        ["This Month"]: number | null;
        ["Last Month"]?: number | null;
      };
    } = {};

    Interval.fromDateTimes(
      DateTime.fromJSDate(range.from).startOf("day"),
      DateTime.fromJSDate(range.to).endOf("day")
    )
      .splitBy({ day: 1 })
      .forEach((d, i) => {
        datesObj[
          d.start?.toJSDate().toLocaleDateString("en-us", {
            month: "short",
            day: "2-digit",
          }) || ""
        ] = {
          "This Month": i === 0 ? 0 : null,
          "Last Month": i === 0 ? 0 : null,
        };
      });

    let total = 0;
    let lastMonthTotal = 0;

    transactions
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .forEach((transaction) => {
        if (
          transaction.amount <= 0 ||
          transaction.account.type !== "credit_card"
        ) {
          return;
        }

        const date = new Date(transaction.date).toLocaleDateString("en-us", {
          month: "short",
          day: "2-digit",
        });

        total += transaction.amount / 100;

        datesObj = {
          ...datesObj,
          [date]: {
            "This Month": total,
          },
        };
      });

    lastMonthTransactions
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .forEach((transaction) => {
        if (
          transaction.amount <= 0 ||
          transaction.account.type !== "credit_card"
        ) {
          return;
        }

        const date = new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date(transaction.date).getDate()
        ).toLocaleDateString("en-us", {
          month: "short",
          day: "2-digit",
        });

        lastMonthTotal += transaction.amount / 100;

        datesObj = {
          ...datesObj,
          [date]: {
            ...datesObj[date],
            "Last Month": lastMonthTotal,
          },
        };
      });

    const result: {
      date: string;
      ["This Month"]: number | null;
      ["Last Month"]?: number | null;
    }[] = [];

    Object.keys(datesObj).forEach((date, i) => {
      if (new Date(date).getMonth() !== new Date().getMonth()) return;

      const total =
        new Date(date).getDate() < new Date().getDate()
          ? datesObj[date]["This Month"] || result[i - 1]?.["This Month"] || 0
          : null;
      result.push({
        date,
        "This Month": total,
        "Last Month":
          datesObj[date]["Last Month"] || result[i - 1]?.["Last Month"] || 0,
      });
    });

    return result;
  }, [transactions]);

  if (!data || !transactions || transactions.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="p-0">
      <Title>Monthly Credit Card Spend</Title>
      <AreaChart
        className="h-72 mt-4 [&_.stroke-slate-500]:opacity-40"
        data={chartData}
        index="date"
        categories={["This Month", "Last Month"]}
        colors={["green", "slate"]}
        valueFormatter={(value) => CurrencyFormatter.format(value)}
        yAxisWidth={75}
      />
    </Card>
  );
};
