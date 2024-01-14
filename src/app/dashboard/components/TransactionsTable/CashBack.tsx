import { Flex, Button } from "@tremor/react";
import { useState } from "react";
import { TTransaction } from "../../../../models/transaction";
import { HttpClient } from "../../../hooks/http-client";
import { useTransactions } from "../../../hooks/useTransactions";
import { Color } from "../../../styles";

type Props = {
  transaction: TTransaction;
};

export const CashBack = ({ transaction }: Props) => {
  const [editingCashBack, setEditingCashBack] = useState(false);

  const { refetch } = useTransactions();

  if (!transaction.cashBackAmount) return null;

  const onSaveCashBackAmount = async ({
    cashBackAmount,
    cashBackPercent,
  }: {
    cashBackAmount: number;
    cashBackPercent: number;
  }) => {
    await HttpClient.put(`api/transactions/${transaction.id}`, {
      cashBackAmount,
      cashBackPercent,
    });

    setEditingCashBack(false);

    refetch();
  };

  if (editingCashBack) {
    return (
      <Flex className="flex-col gap-2">
        <Flex>
          {[1, 2, 3, 4, 6].map((num) => {
            return (
              <Button
                key={num}
                variant="light"
                onClick={() =>
                  onSaveCashBackAmount({
                    cashBackAmount: Math.round(
                      transaction.amount * (num * 0.01)
                    ),
                    cashBackPercent: num,
                  })
                }
              >
                {num}%
              </Button>
            );
          })}
          <Button
            color={Color.Rose}
            variant="light"
            onClick={() => setEditingCashBack(false)}
          >
            Cancel
          </Button>
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex className="justify-end">
      <Button variant="light" onClick={() => setEditingCashBack(true)}>
        ${Math.abs(transaction.cashBackAmount / 100).toFixed(2)} (
        {transaction.cashBackPercent || transaction.account.cashBackPercent}%)
      </Button>
    </Flex>
  );
};