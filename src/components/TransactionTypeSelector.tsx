import { TransactionType } from "../types/Transactions";

interface TransactionTypeSelectorProps {
  value: TransactionType;
  id?: string;
  onchange: (type: TransactionType) => void;
}

const TransactionTypeSelector = ({ value, id, onchange }: TransactionTypeSelectorProps) => {
  const transactionsTypeButtons = [
    {
      type: TransactionType.EXPENSE,
      label: "Despesa",
      activeClasses: "bg-red-100 border-red-500 text-red-700 font-medium",
      inactiveClasses: "br-transparent border-red-300 text-red-500 hover:bg-red-50",
    },

    {
      type: TransactionType.INCOME,
      label: "Receita",
      activeClasses: "bg-green-100 border-green-500 text-green-700 font-medium",
      inactiveClasses: "br-transparent border-green-300 text-green-500 hover:bg-green-50",
    },
  ];

  return (
    <fieldset id={id} className="grid grid-cols-2 gap-4">
      {transactionsTypeButtons.map((item) => (
        <button
          key={item.type}
          type="button"
          onClick={() => onchange(item.type)}
          className={`flex cursor-pointer items-center justify-center border rounded-md py-2 px-4 transition-all
             ${value === item.type ? item.activeClasses : item.inactiveClasses}
            
            
            
            `}
        >
          {item.label}
        </button>
      ))}
    </fieldset>
  );
};

export default TransactionTypeSelector;
