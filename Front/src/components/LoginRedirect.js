import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from '../pages/Login';
function LoginRedirect(){
    const navigate = useNavigate();

    useEffect(() => {
        const storedLoginState = localStorage.getItem('user');
        if(storedLoginState === null){
            navigate('/login');
        }
        else{
            navigate('/main');
        }
    }, [navigate]);

    return <Login/>;
}

export default LoginRedirect;