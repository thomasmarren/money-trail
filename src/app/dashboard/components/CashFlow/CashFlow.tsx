import { DateRangePickerValue } from "@tremor/react";
import { TAccount } from "../../../../models/account";
import { TTransaction } from "../../../../models/transaction";
import { useApiGet } from "../../../hooks/useApiGet";
import { CashFlowChart } from "../CashFlowChart";
import { Summary } from "./Summary";
import { filterSpend, filterIncome } from "./utils";

type Props = {
  range: DateRangePickerValue;
};

export const CashFlow = ({ range }: Props) => {
  const { data: transactions } =
    useApiGet<(TTransaction & { account: TAccount })[]>("/api/transactions");

  if (!transactions) return <div>Loading...</div>;

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
