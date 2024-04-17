import { DateRangePicker, DateRangePickerItem } from "@tremor/react";
import { DateTime } from "luxon";
import { useTransactionContext } from "../contexts/TransactionsContext";

export const Header = () => {
  const { range, setRange } = useTransactionContext();

  const firstOfCurrentMonth = DateTime.local().startOf("month").toJSDate();

  const lastMonth = {
    from: DateTime.local().minus({ month: 1 }).startOf("month").toJSDate(),
    to: DateTime.local().minus({ month: 1 }).endOf("month").toJSDate(),
  };

  const startOfYear = DateTime.local().startOf("year").toJSDate();

  return (
    <div className="flex mb-12">
      <h1 className="text-5xl font-bold">💰 Money Trail</h1>
      <div className="ml-auto">
        <DateRangePicker
          className="max-w-lg ml-auto"
          value={range}
          onValueChange={setRange}
          selectPlaceholder="Select Range"
          color="rose"
        >
          <DateRangePickerItem
            key="current_month"
            value="current_month"
            from={firstOfCurrentMonth}
          >
            This month
          </DateRangePickerItem>
          <DateRangePickerItem
            key="last_month"
            value="last_month"
            from={lastMonth.from}
            to={lastMonth.to}
          >
            Last month
          </DateRangePickerItem>
          <DateRangePickerItem
            key="this_year"
            value="this_year"
            from={startOfYear}
          >
            This Year
          </DateRangePickerItem>
        </DateRangePicker>
      </div>
    </div>
  );
};
