import {
  DateRangePickerValue,
  Grid,
  Card,
  Flex,
  Metric,
  Badge,
  ProgressBar,
  Title,
  Text,
} from "@tremor/react";
import { TAccount } from "../../../../models/account";
import { TTransaction } from "../../../../models/transaction";
import { TTransactionType } from "../../../../models/transaction-type";
import { filterSpend, filterIncome, filterBills } from "./utils";

type Props = {
  transactions: (TTransaction & {
    account: TAccount;
    type: TTransactionType;
  })[];
  spend: number;
  income: number;
  range: DateRangePickerValue;
};

export const Summary = ({ transactions, range, spend, income }: Props) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const totalCashBack = transactions.reduce((acc, transaction) => {
    return (acc += transaction.cashBackAmount || 0);
  }, 0);

  const items = [
    {
      title: "Income",
      metric: `${formatter.format(income)}`,
    },
    {
      title: "Spend",
      metric: `${formatter.format(spend)}`,
    },
    {
      title: "Net",
      metric: `${formatter.format(income - spend)}`,
      progress: Math.round((spend / income) * 100),
      isCloseToTarget: income - spend < 1000,
      target: `${formatter.format(income)}`,
    },
    {
      title: "Cash Back",
      metric: `${formatter.format(totalCashBack / 1000)}`,
    },
  ];

  const lastMonth = (() => {
    if (!range.to || !range.from) return null;

    const { to, from } = range;
    const newTo = new Date(to);
    const newFrom = new Date(from);
    newTo.setMonth(range.to.getMonth() - 1);
    newFrom.setMonth(range.to.getMonth() - 1);
    return { to: newTo, from: newFrom };
  })();

  const lastMonthSpend = lastMonth
    ? filterSpend({
        range: {
          to: lastMonth.to,
          from: lastMonth.from,
        },
        transactions,
      })
    : 0;
  const lastMonthIncome = lastMonth
    ? filterIncome({
        range: {
          to: lastMonth.to,
          from: lastMonth.from,
        },
        transactions,
      })
    : 0;

  const bills = filterBills({ range, transactions });

  const incomeDiff = Math.round(income - lastMonthIncome);
  const spendDiff = Math.round(spend - lastMonthSpend);
  return (
    <Grid numItemsMd={2} numItemsLg={3} className="gap-6 mb-12">
      {items.map((item) => {
        return (
          <Card key={item.title}>
            <Flex alignItems="start">
              <div className="truncate">
                <Text>{item.title}</Text>
                <Metric className="truncate">{item.metric}</Metric>
              </div>
              <div>
                {["Spend", "Income"].includes(item.title) && (
                  <Text className="text-xs">Last Month</Text>
                )}
                {item.title === "Income" ? (
                  <Badge color={incomeDiff > 0 ? "emerald" : "red"}>
                    {formatter.format(lastMonthIncome)}
                  </Badge>
                ) : ["Net", "Cash Back"].includes(item.title) ? null : (
                  <Badge color={spendDiff < 0 ? "amber" : "green"}>
                    {formatter.format(lastMonthSpend)}
                  </Badge>
                )}
              </div>
            </Flex>
            {item.progress && (
              <>
                <Flex className="mt-4 space-x-2">
                  <Text className="truncate">{`${item.progress}%`}</Text>
                  <Text className="truncate">{item.target}</Text>
                </Flex>
                <ProgressBar
                  value={item.progress}
                  className="mt-2"
                  color={item.isCloseToTarget ? "amber" : "green"}
                />
              </>
            )}
            {item.title === "Spend" && (
              <Flex className="mt-4">
                <div className="truncate">
                  <Text>Bills</Text>
                  <Title className="truncate">
                    {formatter.format(Math.abs(bills))}
                  </Title>
                </div>
              </Flex>
            )}
          </Card>
        );
      })}
    </Grid>
  );
};
