import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthProvider/AuthProvider';
import { FaDollarSign, FaPiggyBank, FaTrash } from 'react-icons/fa6';
import toast, { Toaster } from 'react-hot-toast';
import { MdOutlineDateRange } from 'react-icons/md';
import { ClipLoader } from 'react-spinners';

const Savings = () => {
  const [savings, setSavings] = useState([]);
  const { user } = useContext(AuthContext);
  const email = user.email;
  const [savingAdded, setSavingAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getSavings = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/savings/${email}`);
        setSavings(response.data);
      } catch (error) {
        toast.error('Error fetching savings');
      }
      setLoading(false);
    };
    getSavings();
    setSavingAdded(false);
  }, [email, savingAdded]);

  const handleSavings = async (e) => {
    e.preventDefault();
    setLoading(true);
    const source = e.target.source.value;
    const amount = parseFloat(e.target.amount.value);
    const date = e.target.date.value;
    await axios.post('http://localhost:3000/savings', { email, source, amount, date });
    setSavingAdded(true);
    toast.success('Saving added successfully', {
      position: "top-right",
      duration: 6000
    });
    setLoading(false);
    e.target.reset();
  };

  const handleDelete = async (id) => {
    setLoading(true);
    await axios.delete(`http://localhost:3000/savings/${id}`);
    setSavingAdded(true);
    toast.success('Saving deleted successfully', {
      position: "top-right",
      duration: 6000
    });
    setLoading(false);
  };

  const totalSavings = savings.reduce((acc, saving) => acc + parseFloat(saving.amount), 0).toFixed(2);

  return (
    <div className="w-full bg-gray-100 pb-32">
      <Toaster />
      <div className="text-center text-3xl rounded-xl bg-indigo-900 w-[90%] mx-auto max-w-7xl p-4 text-white">
        Total Savings: <span className="font-bold">${totalSavings}</span>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader size={50} color={"#4f46e5"} loading={loading} />
        </div>
      ) : (
        <div className="flex flex-col md:flex-row justify-between max-w-[85%] mx-auto mt-6">
          <form onSubmit={handleSavings} className="mt-4 flex flex-col md:w-[30%] bg-white p-6 shadow-lg rounded-lg space-y-4 max-h-72">
            <input type="text" placeholder="Source" name="source" required className="p-2 border border-gray-300 rounded bg-gray-200 placeholder:text-gray-800 placeholder:text-opacity-65" />
            <input type="number" placeholder="Amount" step="0.01" name="amount" required className="p-2 border border-gray-300 rounded bg-gray-200 placeholder:text-gray-800 placeholder:text-opacity-65" />
            <input type="date" placeholder="Date" name="date" required className="p-2 border border-gray-300 rounded bg-gray-200 placeholder:text-gray-800 placeholder:text-opacity-65" />
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded">
              Add Saving
            </button>
          </form>

          <div className="md:w-[60%] bg-white p-6 shadow-lg rounded-lg mt-4 md:mt-0 ">
            <h3 className="text-xl font-semibold mb-3">Savings List</h3>
            <ul className="space-y-4 ">
              {savings && savings.map(saving => (
                <li key={saving._id} className="flex justify-between items-center p-4 bg-gray-100 rounded-lg hover:bg-gray-200">
                  <div className="flex items-center gap-2">
                    <FaPiggyBank className="text-green-500" />
                    <div className="ml-2">
                      <span className="block font-bold">{saving.source}</span>
                      <div className="flex flex-row gap-3 text-gray-600">
                        <span className='flex justify-center items-center'><FaDollarSign />
                          {`${saving.amount}`}</span>
                        <span className='flex justify-center items-center'><MdOutlineDateRange />
  {saving.date}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(saving._id)} className="text-red-500 hover:text-red-700">
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

export default Savings;
