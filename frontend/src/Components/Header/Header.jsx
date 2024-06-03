import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../AuthProvider/AuthProvider";
import { FaAngleDown } from "react-icons/fa6";

const Header = () => {
    const { user, signOut } = useContext(AuthContext);
    console.log('header',user);
  return (
    <header className=" bg-white shadow sticky top-0 z-50 w-full">
        <nav className="flex justify-between items-center py-3 container mx-auto bg-white">
            {user? (
              <Link to="/dashboard"><button className="btn btn-ghost text-2xl text-green-600 hover:bg-white hover:shadow-md font-bold    px-1 md:p-0 ml-2 md:ml-0">MoneyMate</button></Link>
            ):(
              <Link to="/"><button className="btn btn-ghost text-2xl text-green-600 hover:bg-white hover:shadow-md font-bold    px-1 md:p-0">MoneyMate</button></Link>
            )}



            {!user && <Link to="/whyus">
            <div className="text-green-600 font-sans flex flex-row justify-center items-center gap-3">
              Why Us 
              <FaAngleDown />
            </div>
            </Link>}
            <div>
            {user ? (
              <div className="flex gap-4">
                <div className="flex justify-center items-center">
                  hi, <span className="text-green-600">{user?.username}</span> 
                </div>
                <button onClick={signOut} className=" text-white font-space-4 border-[1px] hover:bg-green-600 px-3 py-1  hover:shadow-xl rounded-md bg-blue-950  mr-2 md:mr-0">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 md:gap-3 pr-[1px] md:pr-3">
                <Link to="/login">
                  <button className=" text-black font-space-4 border-black border-[1px] px-3 py-1  hover:shadow-xl rounded-md">
                    Login
                  </button>
                </Link>
                <Link to="/register">
                  <button className=" text-white font-space-4 border-[1px] border-blue-950 hover:bg-green-600 px-3 py-1  hover:shadow-xl rounded-md bg-blue-950 mr-2 md:mr-0">
                    Register
                  </button>
                </Link>
              </div>
            )}
            </div>
        </nav>
    </header>
  );
};

export default Header;
