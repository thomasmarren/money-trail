"use client";

import {
  Card,
  Flex,
  Table,
  TableBody,
  TableHead,
  TableHeaderCell,
  TableRow,
  Title,
} from "@tremor/react";
import { TAccount } from "../../../../models/account";
import { TTransaction } from "../../../../models/transaction";
import { TTransactionType } from "../../../../models/transaction-type";
import { useTransactionContext } from "../../contexts/TransactionsContext";
import { Filter } from "./Filter";
import { Row } from "./Row";

export const TransactionsTable = () => {
  const { transactions } = useTransactionContext();

  const pending: (TTransaction & {
    account: TAccount;
    type: TTransactionType;
  })[] = [];
  const posted: (TTransaction & {
    account: TAccount;
    type: TTransactionType;
  })[] = [];
  transactions.forEach((transaction) => {
    if (transaction.payload["Is Pending"] === "Yes") {
      pending.push(transaction);
    } else {
      posted.push(transaction);
    }
  });

  if (!posted || !pending) return <div>Loading...</div>;

  return (
    <div>
      <Filter />
      <Card>
        <div>
          <Flex>
            <Title>Viewing {transactions.length} Transactions</Title>
          </Flex>
        </div>
        <Table className="mt-6">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell className="text-left">Account</TableHeaderCell>
              <TableHeaderCell className="text-left">
                Description
              </TableHeaderCell>
              <TableHeaderCell className="text-right">
                Amount ($)
              </TableHeaderCell>
              <TableHeaderCell className="text-right">
                Cash Back ($)
              </TableHeaderCell>
              <TableHeaderCell className="text-right" />
            </TableRow>
          </TableHead>

          <TableBody>
            {pending.map((transaction) => (
              <Row key={transaction.id} transaction={transaction} />
            ))}
            {posted.map((transaction) => (
              <Row key={transaction.id} transaction={transaction} />
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
