import {
  BarChart as TremorBarChart,
  BarChartProps,
  LineChart,
  Title,
} from "@tremor/react";
import { Card } from "antd";
import { useMemo } from "react";
import { TAccount } from "../../../../models/account";
import { useApiGet } from "../../../hooks/useApiGet";
import { CurrencyFormatter } from "../../../utils/currency-formatter";
import { useTransactionContext } from "../../contexts/TransactionsContext";
import styled from "@emotion/styled";

const BarChart = styled(TremorBarChart)`
  .recharts-bar-rectangles {
    ${({ accountcolors }: { accountcolors: string[] }) => {
      return accountcolors.map((color, i) => {
        return `
        > :nth-child(${i + 1}) {
          fill: ${color};
        }
        `;
      });
    }}
  }
`;

const valueFormatter = (number: number) =>
  `$ ${new Intl.NumberFormat("us").format(number).toString()}`;

export const SpendByCard = () => {
  const { data } = useApiGet<TAccount[]>("/api/accounts");

  const { transactions } = useTransactionContext();

  const accounts = (data || []).filter(
    (account) => account.type === "credit_card"
  );

  const chartData = useMemo(() => {
    const colors: { [account: string]: string } = {};
    const barData: { [account: string]: number } = {};

    let datesObj: { [date: string]: { [accountName: string]: number } } = {};
    let totalObj: { [account: string]: number } = {};

    transactions
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .forEach((transaction) => {
        if (
          transaction.amount <= 0 ||
          transaction.account.type !== "credit_card"
        ) {
          return;
        }

        if (barData[transaction.account.name]) {
          barData[transaction.account.name] += transaction.amount / 100;
        } else {
          colors[transaction.account.name] = transaction.account.color;
          barData[transaction.account.name] = transaction.amount / 100;
        }

        const date = new Date(transaction.date).toLocaleDateString("en-us", {
          month: "short",
          day: "2-digit",
        });

        if (!datesObj[date]) {
          datesObj = { ...datesObj, [date]: {} };
        }

        if (!datesObj[date]?.[transaction.account.name]) {
          datesObj[date] = {
            ...datesObj[date],
            [transaction.account.name]: 0,
          };
        }

        totalObj[transaction.account.name] =
          (totalObj[transaction.account.name] || 0) + transaction.amount / 100;

        datesObj = {
          ...datesObj,
          [date]: {
            ...totalObj,
            [transaction.account.name]: totalObj[transaction.account.name],
          },
        };
      });

    const line = Object.keys(datesObj).map((date) => {
      return {
        date,
        ...datesObj[date],
      };
    });

    const sortedBarData: { name: string; Spend: number; color: string }[] = [];
    Object.entries(barData)
      .sort(([, a], [, b]) => a - b)
      .forEach((value) => {
        sortedBarData.push({
          name: value[0],
          Spend: value[1],
          color: colors[value[0]],
        });
      });

    return {
      line,
      bar: sortedBarData,
    };
  }, [transactions]);

  if (!data || !transactions || transactions.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="p-0">
      <Title>Spend by Card</Title>
      <LineChart
        className="h-72 mt-4"
        data={chartData.line}
        index="date"
        categories={accounts.map((a) => a.name)}
        enableLegendSlider
        valueFormatter={(value) => CurrencyFormatter.format(value)}
        onValueChange={() => null}
        yAxisWidth={75}
      />
      <BarChart
        className="mt-12"
        data={chartData.bar}
        accountcolors={Object.values(chartData.bar).map(({ color }) => color)}
        colors={["white"]}
        index="name"
        categories={["Spend"]}
        valueFormatter={valueFormatter}
        showLegend={false}
      />
    </Card>
  );
};
