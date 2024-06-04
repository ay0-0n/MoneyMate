import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthProvider/AuthProvider';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts';
import { ClipLoader } from 'react-spinners';
import toast, { Toaster } from 'react-hot-toast';

const COLORS = ['#8884d8', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658'];

const CustomXAxis = (props) => <XAxis {...props} />;
CustomXAxis.defaultProps = {
  dataKey: 'name',
};

const CustomYAxis = (props) => <YAxis {...props} />;
CustomYAxis.defaultProps = {
  dataKey: 'value',
};

const Visuals = () => {
  const { user } = useContext(AuthContext);
  const email = user.email;
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [savings, setSavings] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expensesRes, incomesRes, savingsRes, goalsRes] = await Promise.all([
          axios.get(`http://localhost:3000/expenses/${email}`),
          axios.get(`http://localhost:3000/income/${email}`),
          axios.get(`http://localhost:3000/savings/${email}`),
          axios.get(`http://localhost:3000/goals/${email}`),
        ]);
        setExpenses(expensesRes.data);
        setIncomes(incomesRes.data);
        setSavings(savingsRes.data);
        setGoals(goalsRes.data);
        setLoading(false);
      } catch (error) {
        toast.error('Error fetching data');
      }
    };
    fetchData();
  }, [email]);

  const calculateData = (data, key) => {
    const categories = [...new Set(data.map((item) => item[key]))];
    const categoryTotals = categories.map((category) =>
      data.filter((item) => item[key] === category).reduce((acc, item) => acc + parseFloat(item.amount), 0)
    );
    return { categories, categoryTotals };
  };

  const expenseData = calculateData(expenses, 'category').categories.map((category, index) => ({
    name: category,
    value: calculateData(expenses, 'category').categoryTotals[index],
  }));

  const incomeData = calculateData(incomes, 'source').categories.map((category, index) => ({
    name: category,
    value: calculateData(incomes, 'source').categoryTotals[index],
  }));

  const lineData = expenses.map((expense, index) => ({
    date: new Date(expense.date).toLocaleDateString(),
    expense: expense.amount,
    income: incomes[index]?.amount || 0,
  }));

  const savingsData = savings.map((saving) => ({
    name: saving.source,
    value: saving.amount,
  }));

  const radarData = [
    ...expenseData.map((item) => ({ ...item, type: 'Expense' })),
    ...incomeData.map((item) => ({ ...item, type: 'Income' })),
    ...savingsData.map((item) => ({ ...item, type: 'Savings' })),
  ];

  const goalsData = goals.map((goal) => ({
    name: goal.name,
    amountNeeded: goal.amountNeeded,
    contribution: goal.contribution,
  }));

  return (
    <div className="w-full bg-gray-100 p-6 pb-32">
      <Toaster />
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader size={50} color={"#4f46e5"} loading={loading} />
        </div>
      ) : (
        <>
          <div className="text-center text-3xl rounded-xl bg-indigo-900 w-[90%] mx-auto max-w-7xl p-4 text-white">
            Visualizations
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 max-w-[90%] mx-auto">
            <div className="bg-white p-6 shadow-lg rounded-lg w-full h-96">
              <h3 className="text-xl font-semibold mb-4">Expenses by Category</h3>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={expenseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <CustomXAxis />
                  <CustomYAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white p-6 shadow-lg rounded-lg w-full h-96">
              <h3 className="text-xl font-semibold mb-4">Incomes by Source</h3>
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie data={incomeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                    {incomeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white p-6 shadow-lg rounded-lg w-full h-96">
              <h3 className="text-xl font-semibold mb-4">Savings</h3>
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie data={savingsData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                    {savingsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white p-6 shadow-lg rounded-lg w-full h-96">
              <h3 className="text-xl font-semibold mb-4">Expenses & Incomes Over Time</h3>
              <ResponsiveContainer width="100%" height="90%">
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <CustomXAxis dataKey="date" />
                  <CustomYAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="expense" stroke="#8884d8" />
                  <Line type="monotone" dataKey="income" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white p-6 shadow-lg rounded-lg w-full h-96">
              <h3 className="text-xl font-semibold mb-4">Combined Radar Chart</h3>
              <ResponsiveContainer width="100%" height="90%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis />
                  <Radar name="Expenses" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Radar name="Incomes" dataKey="value" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  <Radar name="Savings" dataKey="value" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white p-6 shadow-lg rounded-lg w-full h-96">
              <h3 className="text-xl font-semibold mb-4">Goals: Amount Needed vs Contribution</h3>
              <ResponsiveContainer width="100%" height="88%">
                <BarChart data={goalsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <CustomXAxis />
                  <CustomYAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="amountNeeded" fill="#8884d8" />
                  <Bar dataKey="contribution" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Visuals;
