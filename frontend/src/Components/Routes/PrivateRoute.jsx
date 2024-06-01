import PropTypes from 'prop-types';
import { useContext } from 'react';
import { AuthContext } from '../AuthProvider/AuthProvider';
import { Navigate } from "react-router-dom"

const PrivateRoute = ({children}) => {
    const {user, loading} = useContext(AuthContext)
    // if(loading){
    //     return <div className='w-screen h-screen flex justify-center bg-gray-100 dark:bg-neutral-800'><span className="loading loading-infinity loading-lg"></span></div>
    // }
    if (user){
        return children
    }
    return <Navigate to='/login'></Navigate>
};

PrivateRoute.propTypes = {
    children: PropTypes.node
};

export default PrivateRoute;