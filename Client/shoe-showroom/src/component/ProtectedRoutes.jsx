import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";



const ProtectedRoute = ({children , role})=>{
    const {user,isAuthenticated,initialized} = useSelector(state => state.auth);
    const dispatch = useDispatch();

    if(!initialized){
        return <div>Loading...</div>
    }
    if(!user || !isAuthenticated){
        return <Navigate to="/login" replace />
    }

    if(role && user.role !== role){
        return <Navigate to="/" replace />
    }

    return children;
}

export default ProtectedRoute;