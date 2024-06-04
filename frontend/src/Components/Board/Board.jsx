import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthProvider/AuthProvider';
import { FaDollarSign, FaMoneyBillWave, FaPiggyBank, FaCoins } from 'react-icons/fa';
import { MdOutlineDateRange } from 'react-icons/md';
import ClipLoader from 'react-spinners/ClipLoader';
import toast, { Toaster } from 'react-hot-toast';

const Board = () => {
  const { user } = useContext(AuthContext);
  const email = user.email;
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [savings, setSavings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expensesRes, incomesRes, savingsRes] = await Promise.all([
          axios.get(`http://localhost:3000/expenses/${email}`),
          axios.get(`http://localhost:3000/income/${email}`),
          axios.get(`http://localhost:3000/savings/${email}`)
        ]);
        setExpenses(expensesRes.data);
        setIncomes(incomesRes.data);
        setSavings(savingsRes.data);
        setLoading(false);
      } catch (error) {
        toast.error("Error fetching data");
      }
    };
    fetchData();
  }, [email]);

  const totalExpense = expenses.reduce((acc, expense) => acc + parseFloat(expense.amount), 0).toFixed(2);
  const totalIncome = incomes.reduce((acc, income) => acc + parseFloat(income.amount), 0).toFixed(2);
  const totalSavings = savings.reduce((acc, saving) => acc + parseFloat(saving.amount), 0).toFixed(2);
  const balance = (totalIncome - totalExpense).toFixed(2);

  const transactions = [...expenses, ...incomes]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="w-full bg-gray-100 p-6 pb-32">
      <Toaster />
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader size={50} color={"#4f46e5"} loading={loading} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
              <FaCoins className="text-green-500 text-3xl mr-4" />
              <div>
                <p className="text-gray-600">Total Income</p>
                <p className="text-2xl font-bold">${totalIncome}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
              <FaMoneyBillWave className="text-red-500 text-3xl mr-4" />
              <div>
                <p className="text-gray-600">Total Expense</p>
                <p className="text-2xl font-bold">${totalExpense}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
              <FaPiggyBank className="text-yellow-500 text-3xl mr-4" />
              <div>
                <p className="text-gray-600">Total Savings</p>
                <p className="text-2xl font-bold">${totalSavings}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
              <FaDollarSign className="text-blue-500 text-3xl mr-4" />
              <div>
                <p className="text-gray-600">Balance</p>
                <p className="text-2xl font-bold">${balance}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
              {transactions.length > 0 ? (
                <ul className="space-y-4">
                  {transactions.map((item) => (
                    <li key={item._id} className="flex justify-between items-center p-4 bg-gray-100 rounded-lg">
                      <div>
                        <span className="block font-bold">{item.description || item.source}</span>
                        <span className="text-gray-600 flex items-center">
                          <MdOutlineDateRange className="mr-1" />
                          {item.date}
                        </span>
                      </div>
                      <span className={`font-bold ${item.category ? 'text-red-500' : 'text-green-500'}`}>
                        {item.category ? `-$${parseFloat(item.amount).toFixed(2)}` : `$${parseFloat(item.amount).toFixed(2)}`}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No Transaction Added yet</p>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Recent Savings</h3>
              {savings.length > 0 ? (
                <ul className="space-y-4">
                  {savings.slice(0, 3).map((saving) => (
                    <li key={saving._id} className="flex justify-between items-center p-4 bg-gray-100 rounded-lg">
                      <div>
                        <span className="block font-bold">{saving.source}</span>
                        <span className="text-gray-600 flex items-center">
                          <MdOutlineDateRange className="mr-1" />
                          {saving.date}
                        </span>
                      </div>
                      <span className="text-green-500 font-bold">${parseFloat(saving.amount).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No savings added yet.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Board;
