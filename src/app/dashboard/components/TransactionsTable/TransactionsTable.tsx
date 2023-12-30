"use client";

import {
  Card,
  DateRangePickerValue,
  Flex,
  Table,
  TableBody,
  TableHead,
  TableHeaderCell,
  TableRow,
  Title,
} from "@tremor/react";
import { useMemo } from "react";
import { TAccount } from "../../../../models/account";
import { TTransaction } from "../../../../models/transaction";
import { useApiGet } from "../../../hooks/useApiGet";
import { Row } from "./Row";

type Props = {
  range: DateRangePickerValue;
};

export const TransactionsTable = ({ range }: Props) => {
  const { data: allTransactions, refetch } =
    useApiGet<(TTransaction & { account: TAccount })[]>("/api/transactions");

  const [posted, pending] = useMemo(() => {
    if (!allTransactions) return [[], []];

    const posted: typeof allTransactions = [];
    const pending: typeof allTransactions = [];
    allTransactions.forEach((transaction) => {
      if (!range.to || !range.from) return;

      const date = new Date(transaction.date);
      if (date <= range.from || date >= range.to) return;

      if (transaction.payload["Is Pending"] === "Yes") {
        pending.push(transaction);
      } else {
        posted.push(transaction);
      }
    });

    return [posted, pending];
  }, [range, allTransactions]);

  if (!allTransactions) return <div>Loading...</div>;

  return (
    <Card>
      <div>
        <Flex>
          <Title>Transactions</Title>
        </Flex>
      </div>
      <Table className="mt-6">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Date</TableHeaderCell>
            <TableHeaderCell className="text-left">Account</TableHeaderCell>
            <TableHeaderCell className="text-left">Description</TableHeaderCell>
            <TableHeaderCell className="text-right">Amount ($)</TableHeaderCell>
            <TableHeaderCell className="text-right" />
          </TableRow>
        </TableHead>

        <TableBody>
          {pending.map((item) => (
            <Row key={item.id} item={item} />
          ))}
          {posted.map((item) => (
            <Row key={item.id} item={item} />
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
