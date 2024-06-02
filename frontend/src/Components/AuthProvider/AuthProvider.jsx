import { createContext, useState } from "react";
import PropTypes from "prop-types";
import axios from 'axios';


export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const signIn = async (email, password, setError, navigate) => {
        try {
            const response = await axios.post('http://localhost:3000/login', {
                email,
                password,
            });

            if (response.data.error) {
                setError(response.data.error);
            } else {
                setUser(response.data.user);
                setLoading(false);
                
                localStorage.setItem('token', response.data.token);
                navigate('/dashboard');
            }
        } catch (error) {
            setError(error.response.data.error);
        }
    };

    const signOut = async () => {
        setUser(null);
        setLoading(false)
        localStorage.removeItem('token');
    };

    const signUp = async (username, email, password, setError, navigate) => {
        try {
            const response = await axios.post('http://localhost:3000/signup', {
                username,
                email,
                password,
            });

            if (response.data.error) {
                setError(response.data.error);
            } else {
                navigate('/login');
            }
        } catch (error) {
            setError(error.response.data.error);
        }
    };

    return (
        <AuthContext.Provider
            value={{ user, setUser, loading, setLoading, signIn, signOut, signUp }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node,
};

export default AuthProvider;
