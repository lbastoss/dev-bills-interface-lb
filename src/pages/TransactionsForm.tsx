import { useEffect, useId, useState } from "react";
import Card from "../components/Card";
import TransactionTypeSelector from "../components/TransactionTypeSelector";
import { getCategories } from "../services/categoryService";
import type { Category } from "../types/category";
import { TransactionType } from "../types/Transactions";

interface FormData {
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
  category: string;
}

const initialFormData = {
  description: "",
  amount: 0,
  type: TransactionType.EXPENSE,
  date: "",
  category: "",
};

const TransactionsForm = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const formId = useId();

  useEffect(() => {
    const fetchCategories = async (): Promise<void> => {
      const response = await getCategories();
      setCategories(response);
    };
    fetchCategories();
  }, []);

  const handleTransactionType = (itemType: TransactionType): void => {
    setFormData((prev) => ({
      ...prev,
      type: itemType,
    }));
  };

  const handleSubmit = () => {};

  return (
    <div>
      <div>
        <h1>Transaction Form</h1>

        <Card>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor={formId}>Tipo de despesa</label>
              <TransactionTypeSelector
                id={formId}
                value={formData.type}
                onchange={handleTransactionType}
              />
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default TransactionsForm;
