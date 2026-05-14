import { AlertCircle, Calendar, DollarSign, Save, Tag } from "lucide-react";
import { type ChangeEvent, type FormEvent, useEffect, useId, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import Select from "../components/Select";
import TransactionTypeSelector from "../components/TransactionTypeSelector";
import { getCategories } from "../services/categoryService";
import { createTransaction } from "../services/transactionService";
import type { Category } from "../types/category";
import { type CreateTransactionDTO, TransactionType } from "../types/Transactions";

interface FormData {
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
  category: string;
  categoryId: string;
}

const initialFormData = {
  description: "",
  amount: 0,
  type: TransactionType.EXPENSE,
  date: "",
  category: "",
  categoryId: "",
};

const TransactionsForm = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const formId = useId();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async (): Promise<void> => {
      const response = await getCategories();
      setCategories(response);
    };
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((category) => category.type === formData.type);

  const validadeForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.description.trim()) {
      errors.description = "Descrição obrigatória";
    }

    if (!formData.amount || formData.amount <= 0) {
      errors.amount = "Valor deve ser maior que zero";
    }

    if (!formData.date) {
      errors.date = "Data obrigatória";
    }

    if (!formData.categoryId) {
      errors.categoryId = "Selecione uma categoria";
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setError("Preencha corretamente os campos obrigatórios.");
      return false;
    }

    return true;
  };

  const handleTransactionType = (itemType: TransactionType): void => {
    setFormData((prev) => ({
      ...prev,
      type: itemType,
    }));
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? (value === "" ? 0 : Number(value)) : value,
    }));
    setFieldErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!validadeForm()) {
        return;
      }

      const transactionData: CreateTransactionDTO = {
        description: formData.description,
        amount: formData.amount,
        categoryId: formData.categoryId,
        type: formData.type,
        date: `${formData.date}T12:00:00.000Z`,
      };

      await createTransaction(transactionData);

      const transactionDate = new Date(formData.date);

      const month = transactionDate.getMonth() + 1;
      const year = transactionDate.getFullYear();

      toast.success("Transação criada com sucesso!");

      navigate(`/transaçoes?month=${month}&year=${year}`);
    } catch (_err) {
      toast.error("Ocorreu um erro ao criar a transação.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/transaçoes");
  };

  return (
    <div className="container-app py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Nova transação</h1>

        <Card>
          {error && (
            <div className="flex items-center bg-red-300 border-red-700 rounded-xl p-4 mb-6 gap-2">
              <AlertCircle className="w-5 h-5 text-red-700" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4 flex gap-2 flex-col">
              <label htmlFor={formId}>Tipo de transação</label>
              <TransactionTypeSelector
                id={formId}
                value={formData.type}
                onchange={handleTransactionType}
              />
            </div>

            <Input
              label="Descrição"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Ex: supermercado, salário, etc..."
              className={fieldErrors.description ? "border-red-500" : ""}
            />

            <Input
              label="Valor"
              name="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              placeholder="R$ 0,00"
              icon={<DollarSign className="w-4 h-4" />}
              className={fieldErrors.amount ? "border-red-500" : ""}
            />

            <Input
              label="Data"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              icon={<Calendar className="w-4 h-4" />}
              className={fieldErrors.date ? "border-red-500" : ""}
            />

            <Select
              label="Categoria"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              icon={<Tag className="w-4" />}
              options={[
                { value: "", label: "Selecione uma categoria" },
                ...filteredCategories.map((category) => ({
                  value: category.id,
                  label: category.name,
                })),
              ]}
              className={fieldErrors.categoryId ? "border-red-500" : ""}
            />

            <div className="flex justify-end space-x-3 mt-2">
              <Button variant="outline" onClick={handleCancel} type="button" disabled={loading}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant={formData.type === TransactionType.EXPENSE ? "danger" : "success"}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-4 border-gray-700 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Salvar
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default TransactionsForm;
