import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthProvider/AuthProvider';
import { FaDollarSign, FaMoneyCheckDollar, FaTrash } from 'react-icons/fa6';
import { MdOutlineDateRange } from 'react-icons/md';
import toast, { Toaster } from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const email = user.email;
  const [incomeAdded, setIncomeAdded] = useState(false);

  useEffect(() => {
    const getIncomes = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/income/${email}`);
        setIncomes(response.data);
      } catch (error) {
        toast.error('Error fetching incomes');
      }
      setLoading(false);
    };
    getIncomes();
    setIncomeAdded(false);
  }, [email, incomeAdded]);

  const handleIncome = async (e) => {
    e.preventDefault();
    setLoading(true);
    const source = e.target.source.value;
    const amount = parseFloat(e.target.amount.value);
    if (isNaN(amount)) {
      toast.error('Please enter a valid amount', {
        position: "top-right",
        duration: 6000
      });
      setLoading(false);
      return;
    }
    const date = e.target.date.value;
    try {
      await axios.post('http://localhost:3000/income', { email, source, amount, date });
      setIncomeAdded(true);
      toast.success('Income added successfully', {
        position: "top-right",
        duration: 6000
      });
    } catch (error) {
      toast.error('Error adding income');
    }
    setLoading(false);
    e.target.reset();
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:3000/income/${id}`);
      setIncomeAdded(true);
      toast.success('Income deleted successfully', {
        position: "top-right",
        duration: 6000
      });
    } catch (error) {
      toast.error('Error deleting income');
    }
    setLoading(false);
  };

  return (
    <div className="w-full bg-gray-100 pb-32">
      <Toaster />
      <div className="text-center text-3xl rounded-xl bg-indigo-900 w-[90%] mx-auto max-w-7xl p-4 text-white">
        Total Income: <span className="font-bold">${incomes ? incomes.reduce((acc, income) => acc + parseFloat(income.amount), 0).toFixed(2) : "0.00"}</span>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader size={50} color={"#4f46e5"} loading={loading} />
        </div>
      ) : (
        <div className="flex flex-col md:flex-row justify-between max-w-[85%] mx-auto mt-6">
          <form onSubmit={handleIncome} className="mt-4 flex flex-col md:w-[30%] bg-white p-6 shadow-lg rounded-lg space-y-4 max-h-72">
            <input type="text" placeholder="Source" name="source" required className="p-2 border border-gray-300 rounded bg-gray-200 placeholder:text-gray-800 placeholder:text-opacity-65" />
            <input type="text" placeholder="Amount" name="amount" required className="p-2 border border-gray-300 rounded bg-gray-200 placeholder:text-gray-800 placeholder:text-opacity-65" />
            <input type="date" placeholder="Date" name="date" required className="p-2 border border-gray-300 rounded bg-gray-200 placeholder:text-gray-800 placeholder:text-opacity-65" />
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded">
              Add Income
            </button>
          </form>

          <div className="md:w-[60%] bg-white p-6 shadow-lg rounded-lg mt-4 md:mt-0 ">
            <h3 className="text-xl font-semibold mb-3">Income List</h3>
            <ul className="space-y-4 ">
              {incomes && incomes.map(income => (
                <li key={income._id} className="flex justify-between items-center p-4 bg-gray-100 rounded-lg hover:bg-gray-200">
                  <div className="flex items-center gap-2">
                    <FaMoneyCheckDollar className="text-green-500" />
                    <div className="ml-2">
                      <span className="block font-bold">{income.source}</span>
                      <div className="flex flex-row gap-3 text-gray-600">
                        <span className='flex justify-center items-center'><FaDollarSign />
                          {`${parseFloat(income.amount).toFixed(2)}`}</span>
                        <span className='flex justify-center items-center'><MdOutlineDateRange />
                          {income.date}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(income._id)} className="text-red-500 hover:text-red-700">
                    <FaTrash />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Income;
