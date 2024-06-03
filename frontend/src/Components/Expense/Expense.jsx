import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthProvider/AuthProvider';
import { FaTrash } from 'react-icons/fa6';
import toast, { Toaster } from 'react-hot-toast';

const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const { user } = useContext(AuthContext);
  const email = user.email;
  const [expenseAdded, setExpenseAdded] = useState(false);
  const [categoryAdded, setCategoryAdded] = useState(false);

  useEffect(() => {
    const getCategories = async () => {
      const response = await axios.get(`http://localhost:3000/categories/${email}`);
      setCategories(response.data);
    };
    getCategories();
    setCategoryAdded(false);
  }, [email, categoryAdded]);

  useEffect(() => {
    const getExpenses = async () => {
      const response = await axios.get(`http://localhost:3000/expenses/${email}`);
      setExpenses(response.data);
    };
    getExpenses();
    setExpenseAdded(false);
  }, [email, expenseAdded]);

  const handleCategory = async (e) => {
    e.preventDefault();
    const name = e.target.category.value;
    await axios.post('http://localhost:3000/category', { email, name });
    setCategoryAdded(true);
    toast.success('Category added successfully', {
      position: "top-right",
      duration: 6000
    });
    e.target.reset();
  };

  const handleExpense = async (e) => {
    e.preventDefault();
    const category = e.target.category.value;
    const description = e.target.description.value;
    const amount = e.target.amount.value;
    const date = e.target.date.value;
    await axios.post('http://localhost:3000/expense', { email, category, description, amount, date });
    setExpenseAdded(true);
    toast.success('Expense added successfully', {
      position: "top-right",
      duration: 6000
    });
    e.target.reset();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3000/expense/${id}`);
    setExpenseAdded(true);
    toast.success('Expense deleted successfully', {
      position: "top-right",
      duration: 6000
    });
  };

  return (
    <div className="w-full bg-white">
      <Toaster />
      <div className="text-center text-3xl rounded-xl bg-indigo-900 w-[90%] mx-auto max-w-7xl p-4 text-white">
        Total Expense: <span className="font-bold">${expenses ? expenses.reduce((acc, expense) => acc + parseInt(expense.amount), 0) : "0"}</span>
      </div>
      <div className="flex flex-col md:flex-row justify-between max-w-[85%] mx-auto mt-6">
        <form onSubmit={handleCategory} className="mt-4 flex flex-col md:w-[30%] bg-white p-6 shadow-lg rounded-lg space-y-4 max-h-72">
          <input type="text" placeholder="New Category" name="category" required className="p-2 border border-gray-300 rounded" />
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded">
            Add Category
          </button>
        </form>

        <form onSubmit={handleExpense} className="mt-4 flex flex-col md:w-[30%] bg-white p-6 shadow-lg rounded-lg space-y-4 max-h-72">
          <select name="category" required className="p-2 border border-gray-300 rounded">
            <option value="" disabled selected>Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category.name}>{category.name}</option>
            ))}
          </select>
          <input type="text" placeholder="Description" name="description" required className="p-2 border border-gray-300 rounded" />
          <input type="number" placeholder="Amount" name="amount" required className="p-2 border border-gray-300 rounded" />
          <input type="date" placeholder="Date" name="date" required className="p-2 border border-gray-300 rounded" />
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded">
            Add Expense
          </button>
        </form>

        <div className="md:w-[60%] bg-white p-6 shadow-lg rounded-lg mt-4 md:mt-0 mb-20">
          <h3 className="text-xl font-semibold mb-3">Expense List</h3>
          {categories.map((category) => (
            <div key={category._id} className="mb-6">
              <h4 className="text-lg font-bold mb-2">{category.name}</h4>
              <ul className="space-y-4">
                {expenses.filter(expense => expense.category === category.name).map(expense => (
                  <li key={expense._id} className="flex justify-between items-center p-4 bg-gray-100 rounded-lg hover:bg-gray-200">
                    <div className="flex items-center gap-2">
                      <div className="ml-2">
                        <span className="block font-bold">{expense.description}</span>
                        <div className="flex flex-row gap-3 text-gray-600">
                          <span>${expense.amount}</span>
                          <span>{expense.date}</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => handleDelete(expense._id)} className="text-red-500 hover:text-red-700">
                      <FaTrash />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Expense;
