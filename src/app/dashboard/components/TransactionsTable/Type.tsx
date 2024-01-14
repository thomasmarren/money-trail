import { Badge } from "@tremor/react";
import { TAccount } from "../../../../models/account";
import { TTransaction } from "../../../../models/transaction";
import { TTransactionType } from "../../../../models/transaction-type";

export const Type = ({
  transaction,
}: {
  transaction: TTransaction & { account: TAccount; type: TTransactionType };
}) => {
  if (transaction.type.id) {
    return (
      <Badge color={transaction.type.color}>{transaction.type.name}</Badge>
    );
  }

  if (transaction.amount >= 0) {
    return <Badge color="red">{transaction.payload.Category}</Badge>;
  }

  return <Badge color="green">Income</Badge>;
};
