"use client";

import {
  Card,
  Flex,
  MultiSelect,
  MultiSelectItem,
  Table,
  TableBody,
  TableHead,
  TableHeaderCell,
  TableRow,
  Title,
} from "@tremor/react";
import { useTransactions } from "../../../hooks/useTransactions";
import { Row } from "./Row";

export const TransactionsTable = () => {
  const { posted, pending, filters, setFilters } = useTransactions();

  if (!posted || !pending) return <div>Loading...</div>;

  return (
    <div>
      <h2>Filter</h2>
      <Flex
        justifyContent="end"
        style={{ maxWidth: "250px", marginBottom: "24px" }}
      >
        <MultiSelect
          value={filters}
          onValueChange={(values: string[]) => setFilters(values)}
        >
          <MultiSelectItem value="income">Income</MultiSelectItem>
          <MultiSelectItem value="paycheck">Paycheck</MultiSelectItem>
        </MultiSelect>
      </Flex>
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
