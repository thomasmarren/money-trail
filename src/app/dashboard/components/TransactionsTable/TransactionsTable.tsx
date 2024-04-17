"use client";

import {
  Accordion,
  AccordionBody,
  AccordionHeader,
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
import { HighestTransactions } from "./HighestTransactions/HighestTransactions";
import { Row } from "./Row";

const sortByDate = (a: { date: string }, b: { date: string }) =>
  new Date(b.date).getTime() - new Date(a.date).getTime();

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
      <HighestTransactions />
      <Accordion>
        <AccordionHeader>
          <h1 className="flex gap-4 text-2xl font-bold">All Transactions</h1>
        </AccordionHeader>
        <AccordionBody>
          <Filter />
          <div>
            <Flex>
              <Title>Viewing all {transactions.length} Transactions</Title>
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
              {pending.sort(sortByDate).map((transaction) => (
                <Row key={transaction.id} transaction={transaction} />
              ))}
              {posted.sort(sortByDate).map((transaction) => (
                <Row key={transaction.id} transaction={transaction} />
              ))}
            </TableBody>
          </Table>
        </AccordionBody>
      </Accordion>
    </div>
  );
};
