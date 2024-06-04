import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthProvider/AuthProvider';
import { FaDollarSign, FaTrash } from 'react-icons/fa6';
import toast, { Toaster } from 'react-hot-toast';
import { MdOutlineDateRange } from 'react-icons/md';
import { FaArrowAltCircleUp, FaDotCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { RxCross2 } from 'react-icons/rx';
import { ClipLoader } from 'react-spinners';

const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const email = user.email;
  const [expenseAdded, setExpenseAdded] = useState(false);
  const [categoryAdded, setCategoryAdded] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/categories/${email}`);
        setCategories(response.data);
      } catch (error) {
        toast.error('Error fetching categories');
      }
      setLoading(false);
    };
    getCategories();
    setCategoryAdded(false);
  }, [email, categoryAdded]);

  useEffect(() => {
    const getExpenses = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/expenses/${email}`);
        setExpenses(response.data);
      } catch (error) {
        toast.error('Error fetching expenses');
      }
      setLoading(false);
    };
    getExpenses();
    setExpenseAdded(false);
  }, [email, expenseAdded]);

  const handleCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    const name = e.target.category.value;
    await axios.post('http://localhost:3000/category', { email, name, budget: 0 });
    setCategoryAdded(true);
    toast.success('Category added successfully', {
      position: "top-right",
      duration: 6000
    });
    setLoading(false);
    e.target.reset();
  };

  const handleExpense = async (e) => {
    e.preventDefault();
    setLoading(true);
    const category = e.target.category.value;
    const description = e.target.description.value;
    const amount = e.target.amount.value.trim();
    const date = e.target.date.value;

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      setLoading(false);
      return;
    }

    const amountFloat = parseFloat(amount);
    const categoryObj = categories.find(cat => cat.name === category);

    const totalExpense = expenses
      .filter(exp => exp.category === category)
      .reduce((acc, exp) => acc + parseFloat(exp.amount), 0);

    if (totalExpense + amountFloat > categoryObj.budget && categoryObj.budget !== 0) {
      Swal.fire({
        title: 'Expense crosses the budget limit, Are you sure you want to add it?',
        showCancelButton: true,
        confirmButtonText: 'Yes, add it',
        cancelButtonText: 'No, cancel'
      }).then(async (result) => {
        if (result.isConfirmed) {
          await addExpense(category, description, amountFloat, date);
        }
        setLoading(false);
      });
    } else {
      await addExpense(category, description, amountFloat, date);
      setLoading(false);
    }

    async function addExpense(category, description, amount, date) {
      await axios.post('http://localhost:3000/expense', { email, category, description, amount, date });
      setExpenseAdded(true);
      toast.success('Expense added successfully', {
        position: "top-right",
        duration: 6000
      });
      e.target.reset();
    }
  };

  const handleDeleteExpense = async (id) => {
    setLoading(true);
    await axios.delete(`http://localhost:3000/expense/${id}`);
    setExpenseAdded(true);
    toast.success('Expense deleted successfully', {
      position: "top-right",
      duration: 6000
    });
    setLoading(false);
  };

  const performDeleteCategory = async (id) => {
    setLoading(true);
    await axios.delete(`http://localhost:3000/category/${id}`);
    setCategoryAdded(true);
    setExpenseAdded(true);
    Swal.fire({
      title: "Deleted!",
      text: "Category has been deleted.",
      icon: "success"
    });
    setLoading(false);
  };

  const handleDeleteCategory = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "The category and its budget will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "rgb(79, 70, 229)",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      showClass: {
        popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `
      }
    }).then((result) => {
      if (result.isConfirmed) {
        performDeleteCategory(id);
      }
    });
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prevState) => ({
      ...prevState,
      [categoryId]: !prevState[categoryId],
    }));
  };

  const Addbudget = (categoryId) => {
    const category = categories.find(cat => cat._id === categoryId);
    if (category.budget > 0) {
      Swal.fire('You already have a budget, delete the previous budget to add again');
      return;
    }

    Swal.fire({
      title: 'Enter a budget so you don\'t overspend',
      input: 'number',
      inputAttributes: {
        min: 1
      },
      showCancelButton: true,
      confirmButtonText: 'Add Budget',
    }).then(async (result) => {
      if (result.isConfirmed && result.value > 0) {
        setLoading(true);
        await axios.patch(`http://localhost:3000/category/${categoryId}`, { budget: parseFloat(result.value) });
        setCategoryAdded(true);
        toast.success('Budget added successfully', {
          position: "top-right",
          duration: 6000
        });
        setLoading(false);
      } else {
        Swal.fire('Budget can\'t be 0');
      }
    });
  };

  const deleteBudget = (categoryId) => {
    Swal.fire({
      title: 'Remove the budget permanently?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        await axios.patch(`http://localhost:3000/category/${categoryId}`, { budget: 0 });
        setCategoryAdded(true);
        toast.success('Budget removed successfully', {
          position: "top-right",
          duration: 6000
        });
        setLoading(false);
      }
    });
  };

  const calculateValue = (categoryId) => {
    const category = categories.find(cat => cat._id === categoryId);
    if (!category) return 0;
    const totalExpense = expenses
      .filter(exp => exp.category === category.name)
      .reduce((acc, exp) => acc + parseFloat(exp.amount), 0);
    return category.budget ? (totalExpense / category.budget) * 100 : 0;
  };

  return (
    <div className="w-full bg-gray-100">
      <Toaster />
      <div className="text-center text-3xl rounded-xl bg-indigo-900 w-[90%] mx-auto max-w-7xl p-4 text-white">
        Total Expense: <span className="font-bold">${expenses.reduce((acc, expense) => acc + parseFloat(expense.amount), 0).toFixed(2)}</span>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader size={50} color={"#4f46e5"} loading={loading} />
        </div>
      ) : (
        <div className="flex flex-col md:flex-row justify-between max-w-[85%] mx-auto mt-6">
          <div className='w-full flex flex-col xl:flex-row xl:justify-around'>
            <form onSubmit={handleCategory} className="mt-4 flex flex-col bg-white p-6 shadow-lg rounded-lg space-y-4 max-h-36">
              <input type="text" placeholder="New Category" name="category" required className="p-2 border border-gray-300 rounded bg-gray-200 placeholder:text-gray-800 placeholder:text-opacity-65" />
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded">
                Add Category
              </button>
            </form>

            <form onSubmit={handleExpense} className="mt-4 flex flex-col bg-white p-6 shadow-lg rounded-lg space-y-4 max-h-80">
              <select name="category" required className="p-2 border border-gray-300 rounded bg-gray-200 placeholder:text-gray-800 placeholder:text-opacity-65 text-black" defaultValue="">
                <option value="" disabled>Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category.name}>{category.name}</option>
                ))}
              </select>
              <input type="text" placeholder="Description" name="description" required className="p-2 border border-gray-300 rounded bg-gray-200 placeholder:text-gray-800 placeholder:text-opacity-65" />
              <input type="text" placeholder="Amount" name="amount" required className="p-2 border border-gray-300 rounded bg-gray-200 placeholder:text-gray-800 placeholder:text-opacity-65" />
              <input type="date" placeholder="Date" name="date" required className="p-2 border border-gray-300 rounded bg-gray-200 placeholder:text-gray-800 placeholder:text-opacity-65" />
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded">
                Add Expense
              </button>
            </form>
          </div>

          <div className="md:w-[60%] bg-white p-6 shadow-lg rounded-lg mt-4 md:mt-0 mb-20">
            <h3 className="text-xl font-semibold mb-3">Expense List</h3>
            {categories.map((category) => (
              <div key={category._id} className={`mb-6 collapse ${expandedCategories[category._id] ? 'collapse-open' : 'collapse-close'} border-black border-b-[1px] border-opacity-20 rounded-none`}>
                <input type="checkbox" checked={expandedCategories[category._id] || false} onChange={() => toggleCategory(category._id)} />
                <label className="text-lg font-bold mb-2 collapse-title flex justify-between items-center cursor-pointer" htmlFor={`collapse-${category._id}`}>
                  <div className='flex flex-col justify-center items-center w-full mx-auto gap-2'>
                    <span className='flex flex-row justify-start gap-6 items-center w-full'>
                      <FaDotCircle className={expandedCategories[category._id] ? 'text-indigo-700' : 'text-gray-500'} />
                      {category.name}
                    </span>
                  </div>
                </label>
                <div className="collapse-content">
                  <div className='border-[1px] border-black p-2 pt-2 rounded border-opacity-5 mb-4'>
                    {category.budget !== 0 && <div className='w-full flex flex-row gap-2 justify-center items-center mb-2'>
                      <progress className={`progress ${calculateValue(category._id) > 100 ? 'progress-error' : 'progress-primary'}`} value={calculateValue(category._id)} max="100"></progress>
                      <button onClick={() => deleteBudget(category._id)}><RxCross2 className='text-xl text-red-500' /></button>
                    </div>}
                    <div className='flex flex-row justify-center items-center gap-10 bg-gray-300 py-3 rounded-lg mb-2 mt-1'>
                      <button onClick={() => Addbudget(category._id)} className="text-indigo-600 hover:text-indigo-800 ">
                        <FaArrowAltCircleUp />
                      </button>

                      <button onClick={() => handleDeleteCategory(category._id)} className="text-red-500 hover:text-red-700">
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  <ul className="space-y-4">
                    {expenses.filter(expense => expense.category === category.name).length > 0 ? expenses.filter(expense => expense.category === category.name).map(expense => (
                      <li key={expense._id} className="flex justify-between items-center p-4 bg-gray-100 rounded-lg hover:bg-gray-200">
                        <div className="flex items-center gap-2">
                          <div className="ml-2">
                            <span className="block font-bold">{expense.description}</span>
                            <div className="flex flex-row gap-3 text-gray-600">
                              <span className='flex justify-center items-center'><FaDollarSign /> ${parseFloat(expense.amount).toFixed(2)}</span>
                              <span className='flex justify-center items-center'><MdOutlineDateRange /> {expense.date}</span>
                            </div>
                          </div>
                        </div>
                        <button onClick={() => handleDeleteExpense(expense._id)} className="text-red-500 hover:text-red-700">
                          <FaTrash />
                        </button>
                      </li>
                    )) : <p>No expense added in this category</p>}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Expense;
