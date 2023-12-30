import {
  TableRow,
  TableCell,
  DatePicker,
  Badge,
  DatePickerValue,
} from "@tremor/react";
import { TAccount } from "../../../../models/account";
import { TTransaction } from "../../../../models/transaction";
import { TTransactionType } from "../../../../models/transaction-type";
import { useApiGet } from "../../../hooks/useApiGet";

type Props = {
  item: TTransaction & { account: TAccount; type: TTransactionType };
};

const Type = ({ item }: Props) => {
  if (item.type.id) {
    return <Badge color={item.type.color}>{item.type.name}</Badge>;
  }

  if (item.amount >= 0) return <Badge color="red">Spend</Badge>;

  return <Badge color="green">Income</Badge>;
};

export const Row = ({ item }: Props) => {
  const { refetch } =
    useApiGet<(TTransaction & { account: TAccount })[]>("/api/transactions");

  const setValue = async ({
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
      key={item.id}
      className={item.payload["Is Pending"] === "Yes" ? "bg-slate-100" : ""}
    >
      <TableCell>
        <DatePicker
          enableClear={false}
          className="max-w-md mx-auto"
          value={new Date(item.date)}
          onValueChange={(date) => setValue({ id: item.id, date })}
        />
      </TableCell>
      <TableCell className="text-left">{item.account.name}</TableCell>
      <TableCell className="text-left max-w-md text-ellipsis overflow-hidden">
        {item.payload.Description}
      </TableCell>
      <TableCell className="text-right">
        ${Math.abs(item.amount / 100).toFixed(2)}
      </TableCell>
      <TableCell className="text-right">
        <Type item={item} />
      </TableCell>
    </TableRow>
  );
};
