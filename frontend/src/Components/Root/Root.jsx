import { Helmet } from 'react-helmet-async';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';

const Root = () => {
    return (
        <div className='bg-white'>
            <Helmet>
              <title>MoneyMate</title>
            </Helmet>
            <Header/>
            <Outlet/>    
        </div>
    );
};

export default Root;