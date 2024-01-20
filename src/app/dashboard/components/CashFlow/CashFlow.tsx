import { DateRangePickerValue } from "@tremor/react";
import { useTransactionContext } from "../../contexts/TransactionsContext";
import { CashFlowChart } from "../CashFlowChart";
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
      <CashFlowChart income={income} spend={spend} />
    </div>
  );
};
