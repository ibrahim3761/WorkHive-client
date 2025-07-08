import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Authentication/Login";
import Register from "../Pages/Authentication/Register";
import Profile from "../Pages/Profile/Profile";
import PrivateRoutes from "../Provider/PrivateRoutes";
import DashBoardLayout from "../Layouts/DashBoardLayout";
import DashaordHome from "../Pages/Dashboard/DashboardHome/DashboardHome";
import PuchaseCoin from "../Pages/Dashboard/BuyerDash/PurchaseCoin/PuchaseCoin";
import PaymentHistory from "../Pages/Dashboard/BuyerDash/PaymentHistory/PaymentHistory";
import AddTask from "../Pages/Dashboard/BuyerDash/AddTask/AddTask";

export const router = createBrowserRouter([
    {
        path:'/',
        Component: RootLayout,
        children:[
            {
                index: true,
                Component: Home
            },
            {
                path:'login',
                Component: Login
            },
            {
                path:'register',
                Component:Register
            },
            {
                path: 'profile',
                element: <PrivateRoutes><Profile></Profile></PrivateRoutes>
            }
        ]
    },
    {
        path: '/dashboard',
        element: <PrivateRoutes><DashBoardLayout></DashBoardLayout></PrivateRoutes>,
        children:[
            {
                index:true,
                Component: DashaordHome
            },
            // buyer routes
            {
                path:"purchase-coin",
                element: <PuchaseCoin></PuchaseCoin>
            },
            {
                path:"payment-history",
                element: <PaymentHistory></PaymentHistory>
            },
            {
                path: "add-task",
                element: <AddTask></AddTask>
            }
        ]
    }
])