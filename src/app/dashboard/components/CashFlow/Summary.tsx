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
import { filterSpend, filterIncome, filterBills } from "./utils";

type Props = {
  transactions: (TTransaction & { account: TAccount })[];
  spend: number;
  income: number;
  range: DateRangePickerValue;
};

export const Summary = ({ transactions, range, spend, income }: Props) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const target = 15000;
  const items = [
    {
      title: "Spend",
      metric: `${formatter.format(spend)}`,
      progress: Math.round((spend / target) * 100),
      target: `${formatter.format(target)}`,
    },
    {
      title: "Income",
      metric: `${formatter.format(income)}`,
      progress: Math.round((income / target) * 100),
      target: `${formatter.format(target)}`,
    },
    {
      title: "Net",
      metric: `${formatter.format(income - spend)}`,
      progress: Math.round((spend / income) * 100),
      target: `${formatter.format(income)}`,
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
                {item.title !== "Net" && (
                  <Text className="text-xs">Last Month</Text>
                )}
                {item.title === "Income" ? (
                  <Badge color={incomeDiff > 0 ? "emerald" : "red"}>
                    {formatter.format(lastMonthIncome)}
                  </Badge>
                ) : item.title === "Net" ? null : (
                  <Badge color={spendDiff < 0 ? "emerald" : "red"}>
                    {formatter.format(lastMonthSpend)}
                  </Badge>
                )}
              </div>
            </Flex>
            {item.title === "Net" && (
              <>
                <Flex className="mt-4 space-x-2">
                  <Text className="truncate">{`${item.progress}%`}</Text>
                  <Text className="truncate">{item.target}</Text>
                </Flex>
                <ProgressBar
                  value={item.progress}
                  className="mt-2"
                  color={item.progress > 80 ? "red" : "green"}
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
