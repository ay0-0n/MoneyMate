import PropTypes from 'prop-types';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../AuthProvider/AuthProvider';
import { Navigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({children}) => {
    const {user,setUser, loading, setLoading} = useContext(AuthContext)

    const token = localStorage.getItem('token')
    useEffect(() => {
        if(token){
            const decodedHeader = jwtDecode(token);
            setUser({username: decodedHeader.username, email: decodedHeader.email})
        }
        setLoading(false) // Move this outside the if block
    }, [])

    if(loading){
        return <div className='w-screen h-screen flex justify-center bg-gray-100 dark:bg-neutral-800'><span className="loading loading-infinity loading-lg"></span></div>
    }
    if (!user){
        return <Navigate to='/login'></Navigate>
    }
    return children
};


PrivateRoute.propTypes = {
    children: PropTypes.node
};

export default PrivateRoute;