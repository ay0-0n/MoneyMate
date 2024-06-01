import Lottie from "lottie-react";
import banner from "./../../assets/banner.json";
import { Link } from "react-router-dom";
import AboutUs from "./AboutUs/AboutUs";
import Footer from "../Footer/Footer";

const Home = () => {
    return (
        <>
        <section className="w-full bg-[#F6F5F0]">
            <div className="flex flex-col-reverse md:flex-row justify-between  items-center px-5">
                <div className="flex flex-col justify-center items-center pl-10 xl:pl-20">
                    <h1 className="text-4xl text-center font-bold mt-10 text-blue-950 xl:text-5xl ">Welcome to MoneyMate</h1>
                    <p className="text-center text-base mt-5 font-space-4">Managing money has never been easier</p>
                    <Link to="/register"> <button className=" text-white bg-green-500 px-4 py-2 rounded-xl mt-4 hover:bg-blue-950
                    ">Get Started</button></Link>
                </div>
                <div className="w-[40%] xl:pr-11">
                    <Lottie animationData={banner} loop={true} />
                </div>
            </div>
            <div className="bg-[#F6F5F0]">
                <div className="bg-[#F6F5F0] h-16 w-[50%] inline-block rotate-6"></div>
                <div className="bg-[#F6F5F0] h-16 w-[50%] inline-block -rotate-6"></div>
            </div>
        </section>

        <AboutUs />
        <Footer/>
        </>

    );
};

export default Home;