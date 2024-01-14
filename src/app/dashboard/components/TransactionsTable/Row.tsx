import {
  TableRow,
  TableCell,
  DatePicker,
  DatePickerValue,
} from "@tremor/react";
import { TAccount } from "../../../../models/account";
import { TTransaction } from "../../../../models/transaction";
import { TTransactionType } from "../../../../models/transaction-type";
import { Amount } from "./Amount";
import { CashBack } from "./CashBack";
import { Type } from "./Type";

type Props = {
  transaction: TTransaction & { account: TAccount; type: TTransactionType };
};

export const Row = ({ transaction }: Props) => {
  const setDateValue = async ({
    id,
    date,
  }: {
    id: string;
    date: DatePickerValue;
  }) => {
    await fetch(`api/transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify({ date }),
    });

    refetch();
  };

  return (
    <TableRow
      key={transaction.id}
      className={
        transaction.payload["Is Pending"] === "Yes" ? "bg-slate-100" : ""
      }
    >
      <TableCell className="text-left max-w-36 ">
        <DatePicker
          enableClear={false}
          className="mx-auto"
          value={new Date(transaction.date)}
          onValueChange={(date) => setDateValue({ id: transaction.id, date })}
        />
      </TableCell>
      <TableCell className="text-left max-w-12 truncate">
        {transaction.account.name}
      </TableCell>
      <TableCell className="text-left max-w-36 text-ellipsis overflow-hidden">
        {transaction.payload.Description}
      </TableCell>
      <TableCell className="text-right">
        <Amount transaction={transaction} />
      </TableCell>
      <TableCell className="text-right max-w-1">
        <CashBack transaction={transaction} />
      </TableCell>
      <TableCell className="text-right">
        <Type transaction={transaction} />
      </TableCell>
    </TableRow>
  );
};
