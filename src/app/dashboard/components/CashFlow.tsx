import { Grid, Card, Flex, Metric, ProgressBar, Text } from "@tremor/react";
import { useState, useEffect } from "react";
import { transactions as TTransaction } from "../../../db/schema";

type Props = {
  date: Date;
};

export const CashFlow = ({ date }: Props) => {
  const [transactions, setTransactions] = useState<
    (typeof TTransaction.$inferSelect)[]
  >([]);

  useEffect(() => {
    fetch("api/transactions").then((response) => {
      response.json().then((data) => {
        setTransactions(data);
      });
    });
  }, []);

  const rawSpend = transactions
    .filter((transaction) => {
      return (
        new Date(transaction.date).getMonth() === date.getMonth() &&
        transaction.amount >= 0
      );
    })
    .reduce((total, transaction) => {
      return (total += transaction.amount);
    }, 0);
  const spend = rawSpend / 100;

  const rawIncome = transactions
    .filter((transaction) => {
      return (
        new Date(transaction.date).getMonth() === date.getMonth() &&
        transaction.amount < 0
      );
    })
    .reduce((total, transaction) => {
      return (total -= transaction.amount);
    }, 0);
  const income = rawIncome / 100;

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const spendTarget = 8000;
  const incomeTarget = 8000;
  const items = [
    {
      title: "Spend",
      metric: `${formatter.format(spend)}`,
      progress: Math.round((spend / spendTarget) * 100),
      target: `${formatter.format(spendTarget)}`,
    },
    {
      title: "Income",
      metric: `${formatter.format(income)}`,
      progress: Math.round((income / incomeTarget) * 100),
      target: `${formatter.format(incomeTarget)}`,
    },
    {
      title: "Net",
      metric: `${formatter.format(income - spend)}`,
      progress: Math.round((spend / income) * 100),
      target: `${formatter.format(income)}`,
    },
  ];

  return (
    <Grid numItemsMd={2} numItemsLg={3} className="gap-6">
      {items.map((item) => {
        return (
          <Card key={item.title}>
            <Flex alignItems="start">
              <div className="truncate">
                <Text>{item.title}</Text>
                <Metric className="truncate">{item.metric}</Metric>
              </div>
            </Flex>
            <Flex className="mt-4 space-x-2">
              <Text className="truncate">{`${item.progress}% (${item.metric})`}</Text>
              <Text className="truncate">{item.target}</Text>
            </Flex>
            <ProgressBar
              value={item.progress}
              className="mt-2"
              color={item.progress > 80 ? "red" : "green"}
            />
          </Card>
        );
      })}
    </Grid>
  );
};
