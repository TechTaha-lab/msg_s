import { useNavigate } from "react-router-dom";

const useLogout = () => {
    const navigate = useNavigate();

    return () => {
        localStorage.removeItem("userInfo");
        navigate('/');
    };
};

export default useLogout;
