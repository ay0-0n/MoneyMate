import { Link } from "react-router-dom";
import { BsDribbble, BsFacebook, BsGithub, BsInstagram, BsTwitter } from "react-icons/bs";

const Footer = () => {
    return (
        <footer className="bg-[#F6F5F0] border-t border-gray-300 pt-8 pb-4">
            <div className="container mx-auto text-gray-700">
                <div className="flex gap-8 justify-between items-center">
                    <div className="mb-7 md:mb-0">
                        <div className=" text-green-600 rounded-md p-1 text-xl px-3 font-bold">
                            MoneyMate
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-6">
                        <div>
                            <h5 className="font-bold mb-2 text-blue-950">About</h5>
                            <ul>
                                <li><Link to="#" className="link link-hover text-gray-600">Our Mission</Link></li>
                                <li><Link to="#" className="link link-hover text-gray-600">About Us</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-bold mb-2 text-blue-950">Follow Us</h5>
                            <ul>
                                <li><Link to="#" className="link link-hover text-gray-600">Github</Link></li>
                                <li><Link to="#" className="link link-hover text-gray-600">Discord</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-bold mb-2 text-blue-950">Legal</h5>
                            <ul>
                                <li><Link to="#" className="link link-hover text-gray-600">Privacy Policy</Link></li>
                                <li><Link to="#" className="link link-hover text-gray-600">Terms &amp; Conditions</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <hr className="my-4 border-gray-400" />
                <div className="flex flex-col sm:flex-row justify-between items-center">
                    <p className="mb-4 sm:mb-0 text-gray-600">
                        &copy; 2024 <Link to="#" className="link link-hover text-blue-950 text-opacity-80">ayo.on™</Link>
                    </p>
                    <div className="flex space-x-6">
                        <Link to="#" className="text-gray-600 hover:text-blue-500"><BsFacebook size={24} /></Link>
                        <Link to="#" className="text-gray-600 hover:text-blue-500"><BsInstagram size={24} /></Link>
                        <Link to="#" className="text-gray-600 hover:text-blue-500"><BsTwitter size={24} /></Link>
                        <Link to="#" className="text-gray-600 hover:text-blue-500"><BsGithub size={24} /></Link>
                        <Link to="#" className="text-gray-600 hover:text-blue-500"><BsDribbble size={24} /></Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
