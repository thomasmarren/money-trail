import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  Card,
  NumberInput,
  Select,
  Table,
  TableBody,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@tremor/react";
import { Row } from "../Row";
import { orderBy } from "../../../../utils/nodash";
import { useTransactionContext } from "../../../contexts/TransactionsContext";
import { isBill, transactionFilter } from "../../CashFlow/utils";
import { useState } from "react";

export const HighestTransactions = () => {
  const { transactions, range } = useTransactionContext();

  const [numOfTransactions, setNumOfTransactions] = useState(5);

  const sortedTransactions = orderBy(
    transactions.filter((transaction) =>
      transactionFilter({
        range,
        transaction,
        extraFilters: [(t) => isBill(t)],
      })
    ),
    "amount",
    "desc"
  ).slice(0, numOfTransactions);

  return (
    <div className="mb-10">
      <Accordion>
        <AccordionHeader>
          <h1 className="flex gap-4 text-2xl font-bold">
            Highest Transactions
          </h1>
        </AccordionHeader>
        <AccordionBody>
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
              {sortedTransactions.map((transaction) => (
                <Row key={transaction.id} transaction={transaction} />
              ))}
            </TableBody>
          </Table>
        </AccordionBody>
      </Accordion>
    </div>
  );
};
