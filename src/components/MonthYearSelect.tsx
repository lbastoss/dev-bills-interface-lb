import { ChevronLeft, ChevronRight } from "lucide-react";

interface MonthYearSelectProps {
  month: number;
  year: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

const monthNames: readonly string[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MonthYearSelect = ({ month, year, onMonthChange, onYearChange }: MonthYearSelectProps) => {
  const currentYear = new Date().getFullYear();
  const years: number[] = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  const handleNextMonth = (): void => {
    if (month === 12) {
      onMonthChange(1);
      onYearChange(year + 1);
    } else {
      onMonthChange(month + 1);
    }
  };
  const handlePrevMonth = (): void => {
    if (month === 1) {
      onMonthChange(12);
      onYearChange(year - 1);
    } else {
      onMonthChange(month - 1);
    }
  };

  return (
    <div className="flex items-center justify-between bg-gray-900 rounded-lg p-3 border border-gray-700 ">
      <button
        type="button"
        className="p-2 rounded-full hover:bg-gray-800 hover:text-primary-500 transition-colors cursor-pointer"
        aria-label="Mês anterior"
        onClick={handlePrevMonth}
      >
        <ChevronLeft />
      </button>

      <div className="flex gap-4">
        <label htmlFor="month-select" className="sr-only">
          Selecionar mês anterior
        </label>
        {/** biome-ignore lint/correctness/useUniqueElementIds: false positive */}
        <select
          id="month-select"
          value={month}
          onChange={(event) => onMonthChange(Number(event.target.value))}
          className="bg-gray-800 border border-gray-700 rounded-md py-1 px-3 text-sm font-medium text-gray-100 focus: outline-none focus:ring-1 focus:ring-primary-500 cursor-pointer"
        >
          {monthNames.map((name, index) => (
            <option key={name} value={index + 1}>
              {name}
            </option>
          ))}
        </select>

        <label htmlFor="year-select" className="sr-only">
          Selecionar ano
        </label>
        {/** biome-ignore lint/correctness/useUniqueElementIds: false positive */}
        <select
          id="year-select"
          value={year}
          onChange={(event) => onYearChange(Number(event.target.value))}
          className="bg-gray-800 border border-gray-700 rounded-md py-1 px-3 text-sm font-medium text-gray-100 focus: outline-none focus:ring-1 focus:ring-primary-500 cursor-pointer"
        >
          {years.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        className="p-2 rounded-full hover:bg-gray-800 hover:text-primary-500 transition-colors cursor-pointer"
        aria-label="Próximo mês"
        onClick={handleNextMonth}
      >
        <ChevronRight />
      </button>
    </div>
  );
};

export default MonthYearSelect;
