import { ArrowDown, ArrowUp, TrendingUp, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { Pie, PieChart, type PieLabelRenderProps, ResponsiveContainer, Tooltip } from "recharts";
import Card from "../components/Card";
import MonthYearSelect from "../components/MonthYearSelect";
import { useAuth } from "../context/AuthContext";
import { getTransactionSummary } from "../services/transactionService";
import type { TransactionSummary } from "../types/Transactions";
import { formatCurrency } from "../utils/formatter";

const initialSummary: TransactionSummary = {
  totalIncomes: 0,
  totalExpenses: 0,
  balance: 0,
  expensesByCategory: [],
};

const Dashboard = () => {
  const currentDate = new Date();
  const [year, setYear] = useState<number>(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [summary, setSummary] = useState<TransactionSummary>(initialSummary);

  const { authState } = useAuth();

  useEffect(() => {
    if (!authState.user) return; // aguarda o Firebase inicializar o usuário

    async function loadTransactionsSummary() {
      try {
        console.log("buscando summary:", { month, year });
        const response = await getTransactionSummary(month, year);
        console.log("response:", response);
        setSummary(response);
      } catch (err) {
        console.error("Erro ao buscar summary:", err);
      }
    }

    loadTransactionsSummary();
  }, [month, year, authState.user]); // re-executa quando o usuário estiver disponível

  const renderPieChatLabel = (props: PieLabelRenderProps): string => {
    const categoryName = props.name ?? "";
    const percent = typeof props.percent === "number" ? props.percent : 0;
    return `${categoryName}: ${(percent * 100).toFixed(1)}%`;
  };

  const formatToolTipValue = (value: number | string | undefined): string => {
    return formatCurrency(typeof value === "number" ? value : 0);
  };

  return (
    <div className="container-app py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Dashboard</h1>
        <MonthYearSelect
          month={month}
          year={year}
          onMonthChange={setMonth}
          onYearChange={setYear}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card icon={<ArrowUp size={20} className="text-primary-500" />} title=" Receitas" hover>
          <p className="text-2xl font-semibold mt-2 text-green-500">
            {formatCurrency(summary.totalIncomes)}
          </p>
        </Card>

        <Card icon={<ArrowDown size={20} className="text-red-600" />} title="Despesas" hover>
          <p
            className="text-2xl font-semibold mt-2
            text-red-600"
          >
            {formatCurrency(summary.totalExpenses)}
          </p>
        </Card>

        <Card
          icon={<Wallet size={20} className="text-primary-500" />}
          title="Saldo"
          hover
          glowEffect={summary.balance > 0}
        >
          <p
            className={`text-2xl font-semibold mt-2
            ${summary.balance >= 0 ? "text-green-500" : "text-red-300"}`}
          >
            {formatCurrency(summary.balance)}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 mt-3 ">
        <Card
          icon={<TrendingUp size={20} className="text-primary-500" />}
          title="Despesas por categoria"
          className="min-h-80"
          hover
        >
          {summary.expensesByCategory.length > 0 ? (
            <div className="mt-4 h-72">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={summary.expensesByCategory.map((e) => ({ ...e, fill: e.categoryColor }))}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="amount"
                    nameKey="categoryName"
                    label={renderPieChatLabel}
                  ></Pie>
                  <Tooltip formatter={formatToolTipValue} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              Nenhuma despesa registrada para este período.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
