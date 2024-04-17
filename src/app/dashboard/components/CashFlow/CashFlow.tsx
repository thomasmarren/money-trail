import { DateRangePickerValue, Grid } from "@tremor/react";
import { useTransactionContext } from "../../contexts/TransactionsContext";
import { CashFlowChart } from "./CashFlowChart";
import { MonthlySpend } from "./MonthlySpend";
import { SpendByCard } from "./SpendByCard";
import { Summary } from "./Summary";
import { filterSpend, filterIncome } from "./utils";

type Props = {
  range: DateRangePickerValue;
};

export const CashFlow = () => {
  const { transactions, range } = useTransactionContext();

  if (!transactions || transactions.length === 0) return <div>Loading...</div>;

  const spend = filterSpend({ range, transactions });
  const income = filterIncome({ range, transactions });

  return (
    <div>
      <Summary
        transactions={transactions}
        range={range}
        spend={spend}
        income={income}
      />
      <Grid numItemsMd={2} numItemsLg={2} className="gap-6 mb-12">
        <CashFlowChart income={income} spend={spend} />
      </Grid>
      <div className="mb-12">
        <MonthlySpend />
      </div>
      <SpendByCard />
    </div>
  );
};
