import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

const AboutUs = () => {
    useEffect(() => {
        AOS.init();
        AOS.refresh();
    }, []);

    return (
        <section className="flex flex-col md:flex-row py-12 mt-6">
            <div className="w-full md:w-1/2 flex justify-center items-center">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdtLH5URhKgipQtkjqaF3W_gIKuOycVN3NWA&s" alt="About Us" className="w-3/4 h-auto" />
            </div>
            <div className="w-full md:w-1/2 px-5">
                <h2 className="text-4xl font-bold text-right text-blue-950 mb-6">About Us</h2>
                <p className="text-right text-gray-700 mb-10" data-aos="fade-up">
                    At MoneyMate, our mission is to empower individuals to take control of their finances through innovative and user-friendly solutions. Our team is dedicated to providing the best financial management tools to help you achieve your financial goals.
                </p>
            </div>
        </section>
    );
};

export default AboutUs;
