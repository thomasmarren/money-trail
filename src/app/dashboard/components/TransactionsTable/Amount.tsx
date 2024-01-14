import { TAccount } from "../../../../models/account";
import { TTransaction } from "../../../../models/transaction";
import { TTransactionType } from "../../../../models/transaction-type";
import { CurrencyFormatter } from "../../../utils/currency-formatter";
import { isCCPayment } from "../CashFlow/utils";

export const Amount = ({
  transaction,
}: {
  transaction: TTransaction & { account: TAccount; type: TTransactionType };
}) => {
  const color = (() => {
    if (isCCPayment(transaction)) return "text-amber-500";

    if (transaction.amount < 0) return "text-lime-600";

    return "text-slate-500";
  })();

  return (
    <span className={`font-bold ${color}`}>
      {transaction.amount > 0 ? "-" : null}
      {CurrencyFormatter.format(Math.abs(transaction.amount / 100))}
    </span>
  );
};
