import { useState } from 'react'
import './App.css'
import { useDispatch } from 'react-redux'
import NavBar from './component/Navbar'
import ProtectedRoute from './component/ProtectedRoutes.jsx'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashbaord from './pages/admin/adminDashboard'
import Cart from './pages/Cart'
import Order from './pages/Order'
import Shoes from './pages/Shoes'
import Home from './pages/Home'
import ShoeDetails from "./pages/ShoeDetails";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";
import OrderDetails from "./pages/OrderDetails";
import AdminOrders from "./pages/admin/AdminOrders.jsx";
import CreateShoe from "./pages/admin/CreateShoe";
import ManageShoes from "./pages/admin/ManageShoes";
import EditShoe from "./pages/admin/EditShoe";
import { setCart } from "./store/cartSlice";
import { getCart } from "./services/cartApi";

import { Routes,Route } from 'react-router-dom'
import { setCredentials, clearAuth , setInitialized} from "./store/authSlice";
import { refreshToken } from "./services/authApi";
import { useEffect } from 'react'

function App() {

  const dispatch = useDispatch();

    useEffect(() => {

        const restoreAuth = async () => {
            try {
                const data = await refreshToken();

                dispatch(
                    setCredentials({
                        user: data.user,
                        accessToken: data.accessToken
                    })
                );

                 if (data.user?.role === "customer") {
                const cartData = await getCart();
                dispatch(setCart(cartData.cart));
                }

            } catch (error) {
                dispatch(clearAuth());
            }finally{
              dispatch(setInitialized(true))
            }
        };

        restoreAuth();

    }, [dispatch]);


  return(
    <>

    <NavBar/>
    
    <Routes>

      <Route path='/' element={<Home/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/register' element={<Register/>}/>
      <Route path='/shoes' element={<Shoes/>}/>
      <Route path="/payment/success" element={<PaymentSuccess />} />
      <Route path="/payment/failure" element={<PaymentFailure />} />

      
      <Route 
        path='/cart' 
        element={
          <ProtectedRoute role="customer">
            <Cart/>
          </ProtectedRoute>
        } 
      />

      <Route
          path="/admin/orders"
          element={
              <ProtectedRoute role="admin">
                  <AdminOrders />
              </ProtectedRoute>
          }
      />

      <Route
          path="/orders/:orderId"
          element={
              <ProtectedRoute role="customer">
                  <OrderDetails />
              </ProtectedRoute>
          }
      />

      <Route
          path="/admin/shoes/create"
          element={
              <ProtectedRoute role="admin">
                  <CreateShoe />
              </ProtectedRoute>
          }
      />
      <Route
          path="/admin/shoes"
          element={
              <ProtectedRoute role="admin">
                  <ManageShoes />
              </ProtectedRoute>
          }
      />
      <Route
          path="/admin/shoes/edit/:shoeId"
          element={
              <ProtectedRoute role="admin">
                  <EditShoe />
              </ProtectedRoute>
          }
      />




      <Route
        path='/orders'
        element={
          <ProtectedRoute role="customer">
            <Order/>
          </ProtectedRoute>
        } 
      />

      <Route
        path='/admin'
        element={
          <ProtectedRoute role="admin">
            <AdminDashbaord/>
          </ProtectedRoute>
        }
      />

      <Route
        path="/shoes/:shoeId"
        element={<ShoeDetails />}
      />

      
    </Routes>
    
    </>

  )
  
}

export default App
