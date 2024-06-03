import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
const AboutUs = () => {
    useEffect(() => {
        AOS.init();
        AOS.refresh();
    }, []);

    return (
        <section className=" py-12 mt-12 lg:mt-24">
            <div className="container mx-auto px-5">
                <div className=' w-3/4 mx-auto'>
                <h2 className="text-4xl font-bold text-center text-blue-950 mb-6">About Us</h2>
                <p className="text-center text-gray-700 mb-10" data-aos="fade-up">
                At MoneyMate, our mission is more than just a statement - it’s a commitment to our users. We strive to empower individuals, giving them the tools and knowledge they need to take control of their finances. Our innovative and user-friendly solutions are designed with the user in mind, making financial management not just accessible, but also intuitive and engaging.
                <br/>
                Our team, a diverse group of dedicated professionals, works tirelessly to ensure that we are providing the best financial management tools available. We believe that everyone deserves the opportunity to achieve their financial goals, and we are committed to making that a reality for our users. We continuously seek to improve and expand our offerings, staying at the forefront of financial technology to deliver the most effective solutions.
                </p>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
