"use client";

import {
  Badge,
  Card,
  Flex,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Title,
} from "@tremor/react";
import { useEffect, useState } from "react";
import {
  transactions as TTransaction,
  accounts as TAccount,
} from "../../../db/schema";

type Props = {
  date: Date;
};

export const TransactionsTable = ({ date }: Props) => {
  const [allTransactions, setTransactions] = useState<
    (typeof TTransaction.$inferSelect & {
      account: typeof TAccount.$inferSelect;
    })[]
  >([]);

  useEffect(() => {
    fetch("api/transactions").then((response) => {
      response.json().then((data) => {
        setTransactions(data);
      });
    });
  }, []);

  const transactions = allTransactions.filter((transaction) => {
    return new Date(transaction.date).getMonth() === date.getMonth();
  });

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
          </TableRow>
        </TableHead>

        <TableBody>
          {transactions.map((item) => (
            <>
              <TableRow key={item.id}>
                <TableCell>{item.date}</TableCell>
                <TableCell className="text-left">{item.account.name}</TableCell>
                <TableCell className="text-left">
                  {item.payload.merchant_name || item.payload.name}
                </TableCell>
                <TableCell className="text-right">
                  {Math.abs(item.amount / 100).toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  {item.amount >= 0 ? (
                    <Badge color="red">Spend</Badge>
                  ) : (
                    <Badge color="green">Income</Badge>
                  )}
                </TableCell>
              </TableRow>
            </>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
