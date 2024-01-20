import {
  TableRow,
  TableCell,
  DatePicker,
  DatePickerValue,
} from "@tremor/react";
import { Tooltip } from "antd";
import { TAccount } from "../../../../models/account";
import { TTransaction } from "../../../../models/transaction";
import { TTransactionType } from "../../../../models/transaction-type";
import { HttpClient } from "../../../hooks/http-client";
import { useTransactionContext } from "../../contexts/TransactionsContext";
import { Amount } from "./Amount";
import { CashBack } from "./CashBack";
import { Type } from "./Type";

type Props = {
  transaction: TTransaction & { account: TAccount; type: TTransactionType };
};

export const Row = ({ transaction }: Props) => {
  const { refetch } = useTransactionContext();

  const setDateValue = async ({
    id,
    date,
  }: {
    id: string;
    date: DatePickerValue;
  }) => {
    await HttpClient.put(`api/transactions/${id}`, { date });

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
        <Tooltip title={transaction.payload.Description}>
          {transaction.payload.Description}
        </Tooltip>
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
