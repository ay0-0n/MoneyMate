import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthProvider/AuthProvider';
import { FaTrash, FaCheckCircle } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';

const Goals = () => {
  const { user } = useContext(AuthContext);
  const email = user.email;
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [goalAdded, setGoalAdded] = useState(false);
  const [contributionMade, setContributionMade] = useState(false);

  useEffect(() => {
    const fetchGoals = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/goals/${email}`);
        setGoals(response.data);
      } catch (error) {
        toast.error('Error fetching goals');
      }
      setLoading(false);
    };
    fetchGoals();
    setGoalAdded(false);
    setContributionMade(false);
  }, [email, goalAdded, contributionMade]);

  const validateNumber = (value) => {
    return !isNaN(value) && value.trim() !== '';
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    const name = e.target.goalName.value;
    const amountNeeded = e.target.amountNeeded.value;
    
    if (!validateNumber(amountNeeded)) {
      toast.error('Please enter a valid number for amount needed');
      return;
    }

    setLoading(true);
    await axios.post('http://localhost:3000/goal', { email, name, amountNeeded: parseFloat(amountNeeded), contribution: 0 });
    setGoalAdded(true);
    toast.success('Goal added successfully', {
      position: "top-right",
      duration: 6000
    });
    setLoading(false);
    e.target.reset();
  };

  const handleContribution = async (e) => {
    e.preventDefault();
    const goalId = e.target.goal.value;
    const contribution = e.target.contribution.value;

    if (!validateNumber(contribution)) {
      toast.error('Please enter a valid number for contribution');
      return;
    }

    setLoading(true);
    const goal = goals.find(goal => goal._id === goalId);
    const amountRemaining = goal.amountNeeded - goal.contribution;

    if (parseFloat(contribution) > amountRemaining) {
      Swal.fire({
        title: 'Contribution exceeds the amount needed. Do you want to continue?',
        showCancelButton: true,
        confirmButtonText: 'Yes, continue',
        cancelButtonText: 'No, cancel'
      }).then(async (result) => {
        if (result.isConfirmed) {
          await makeContribution(goalId, parseFloat(contribution));
        }
        setLoading(false);
      });
    } else {
      await makeContribution(goalId, parseFloat(contribution));
      setLoading(false);
    }
  };

  const makeContribution = async (goalId, contribution) => {
    await axios.patch(`http://localhost:3000/goal/${goalId}`, { contribution });
    setContributionMade(true);
    toast.success('Contribution made successfully', {
      position: "top-right",
      duration: 6000
    });

    const goal = goals.find(goal => goal._id === goalId);
    if (goal.contribution + contribution >= goal.amountNeeded) {
      Swal.fire({
        title: 'Congratulations!',
        text: `You have met your goal: ${goal.name}`,
        width: 600,
        padding: '3em',
        color: '#716add',
        background: '#fff url(/images/trees.png)',
        backdrop: `
          rgba(0,0,123,0.4)
          url("/images/nyan-cat.gif")
          left top
          no-repeat
        `
      });
    }
  };

  const handleDeleteGoal = async (goalId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this goal!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        await axios.delete(`http://localhost:3000/goal/${goalId}`);
        setGoalAdded(true);
        toast.success('Goal deleted successfully', {
          position: "top-right",
          duration: 6000
        });
        setLoading(false);
      }
    });
  };

  return (
    <div className="w-full bg-gray-100 p-6">
      <Toaster />
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader size={50} color={"#4f46e5"} loading={loading} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Add a New Goal</h3>
              <form onSubmit={handleAddGoal} className="space-y-4">
                <input type="text" placeholder="Goal Name" name="goalName" required className="p-2 border border-gray-300 rounded bg-gray-200 placeholder:text-gray-800 placeholder:text-opacity-65" />
                <input type="text" placeholder="Amount Needed" name="amountNeeded" required className="p-2 border border-gray-300 rounded bg-gray-200 placeholder:text-gray-800 placeholder:text-opacity-65" />
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded">
                  Add Goal
                </button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Contribute to a Goal</h3>
              <form onSubmit={handleContribution} className="space-y-4">
                <select name="goal" required className="p-2 border border-gray-300 rounded bg-gray-200 placeholder:text-gray-800 placeholder:text-opacity-65 text-black" defaultValue="">
                  <option value="" disabled>Select Goal</option>
                  {goals.map((goal) => (
                    <option key={goal._id} value={goal._id}>{goal.name}</option>
                  ))}
                </select>
                <input type="text" placeholder="Contribution" name="contribution" required className="p-2 border border-gray-300 rounded bg-gray-200 placeholder:text-gray-800 placeholder:text-opacity-65" />
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded">
                  Contribute
                </button>
              </form>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Goals List</h3>
            {goals.length > 0 ? (
              <ul className="space-y-4">
                {goals.map((goal) => (
                  <li key={goal._id} className="p-4 bg-gray-100 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="block font-bold text-lg">{goal.name}</span>
                      <span className="text-gray-600">${goal.contribution.toFixed(2)} / ${goal.amountNeeded.toFixed(2)}</span>
                      {goal.contribution >= goal.amountNeeded && (
                        <FaCheckCircle className="text-green-500" />
                      )}
                    </div>
                    <progress className="progress progress-primary" value={(goal.contribution / goal.amountNeeded) * 100} max="100"></progress>
                    <button onClick={() => handleDeleteGoal(goal._id)} className="text-red-500 hover:text-red-700 mt-2">
                      <FaTrash />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No goals added yet</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Goals;
