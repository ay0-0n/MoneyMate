import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaUserFriends, FaChartLine, FaShieldAlt, FaSyncAlt, FaClipboardList, FaWallet, FaBullseye, FaCogs } from 'react-icons/fa';
import { useEffect } from 'react';

const features = [
    {
        title: "User-Friendly Interfaces",
        description: "Intuitive, user-friendly, and easily navigable interfaces for a seamless experience.",
        icon: <FaUserFriends className="text-blue-950 text-3xl" />,
    },
    {
        title: "Income and Expense Categorization",
        description: "Categorize sources of income and various types of expenses for precise financial tracking.",
        icon: <FaClipboardList className="text-blue-950 text-3xl" />,
    },
    {
        title: "Budget Creation and Monitoring",
        description: "Establish personalized budgets and receive real-time alerts for budget adherence.",
        icon: <FaWallet className="text-blue-950 text-3xl" />,
    },
    {
        title: "Expense Analytics with Visualizations",
        description: "Generate charts and graphs to illustrate spending patterns over time.",
        icon: <FaChartLine className="text-blue-950 text-3xl" />,
    },
    {
        title: "Recurring Expense Tracking",
        description: "Effortlessly manage recurring expenses with automatic inclusion in budgets.",
        icon: <FaSyncAlt className="text-blue-950 text-3xl" />,
    },
    {
        title: "Setting Financial Goals",
        description: "Define and pursue financial objectives with personalized guidance.",
        icon: <FaBullseye className="text-blue-950 text-3xl" />,
    },
    {
        title: "Ensuring Data Security",
        description: "Implement stringent data security measures to safeguard sensitive user information.",
        icon: <FaShieldAlt className="text-blue-950 text-3xl" />,
    },
    {
        title: "Syncing Data Across Devices",
        description: "Seamlessly sync data across multiple devices for accessibility anytime, anywhere.",
        icon: <FaCogs className="text-blue-950 text-3xl" />,
    },
];

const WhyUs = () => {
    useEffect(() => {
        AOS.init();
        AOS.refresh();
    }, []);
    return (
        <section className="bg-[#F6F5F0] py-12">
            <div className="container mx-auto px-5">
                <h2 className="text-4xl font-bold text-center text-blue-950 mb-10">Why Us</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-white shadow-lg rounded-lg p-6 transition transform hover:scale-105 h-44" data-aos="fade-up">
                            <div className="flex items-center">
                                {feature.icon}
                                <h3 className="text-xl font-semibold text-blue-950 ml-4">{feature.title}</h3>
                            </div>
                            <p className="mt-4 text-gray-600">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyUs;
