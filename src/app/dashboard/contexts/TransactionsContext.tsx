import { createContext, useMemo, useState } from "react";
import { TAccount } from "../../../models/account";
import { TTransaction } from "../../../models/transaction";
import { TTransactionType } from "../../../models/transaction-type";

type State = (TTransaction & {
  account: TAccount;
  type: TTransactionType;
})[];

export const TransactionsContext = createContext({
  transactions: [] as State,
  setTransactions: (_: State) => {},
});

export const TransactionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [transactions, setTransactions] = useState<State>([]);

  const value = useMemo(
    () => ({
      transactions,
      setTransactions,
    }),
    [transactions, setTransactions]
  );

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
};
