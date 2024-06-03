import { Helmet } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import { ImStatsDots } from "react-icons/im";
import { RxHamburgerMenu } from "react-icons/rx";
import { TbBrandGoogleHome, TbMilitaryAward } from "react-icons/tb";
import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import { MdOutlinePriceChange } from "react-icons/md";
import { BiWallet } from "react-icons/bi";

const Dashboard = () => {
  const [nav, setNav] = useState(true);

  return (
    <>
      <Helmet>
        <title>MoneyMate - Dashboard</title>
      </Helmet>
      <Toaster />
      <section className="flex relative bg-white h-screen">
        <div className={`fixed top-0 bg-indigo-950 w-36 md:w-64 text-left pt-4 pl-4 ${nav ? 'left-0' : '-left-64'} top-[4.5rem] bottom-0 transition-all duration-300`}>
          <div className="space-y-3">
            <NavLink to="/dashboard/income" className="block text-gray-300 hover:text-green-600">
              <div className="flex justify-normal items-center gap-2">
                <BiWallet />
                <p>Income</p>
              </div>
            </NavLink>
            <NavLink to="/dashboard/expenses" className="block text-gray-300 hover:text-green-600">
              <div className="flex justify-normal items-center gap-2">
                <MdOutlinePriceChange />
                <p>Expense</p>
              </div>
            </NavLink>
            <NavLink to="/dashboard/goals" className="block text-gray-300 hover:text-green-600">
              <div className="flex justify-normal items-center gap-2">
                <TbMilitaryAward />
                <p>Goals</p>
              </div>
            </NavLink>
          </div>
        </div>
        <div className={`pt-3 w-full bg-white transition-all duration-300 ${nav ? 'ml-36 md:ml-64' : 'ml-0'}`}>
          <Outlet />
        </div>
      </section>

      <div className="btm-nav bg-white text-black border-t-[1px] border-gray-300 max-h-14">
        <button className="bg-white" onClick={() => {
          setNav(!nav)
        }}>
          <RxHamburgerMenu />
        </button>
        <button className="disabled text-black bg-gray-400" tabIndex="-1" aria-disabled="true">
          <TbBrandGoogleHome />
        </button>
        <button>
          <NavLink to="/dashboard/visuals" className="block p-4 hover:bg-gray-200 hover:rounded-xl">
            <ImStatsDots />
          </NavLink>
        </button>
      </div>
    </>
  );
};

export default Dashboard;
