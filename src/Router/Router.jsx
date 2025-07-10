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
import MyTasks from "../Pages/Dashboard/BuyerDash/MyTasks/MyTasks";
import TaskList from "../Pages/Dashboard/WorkerDash/TaskList/TaskList";
import MySubmissions from "../Pages/Dashboard/WorkerDash/MySubmission/MySumissions";
import WithdrawRequest from "../Pages/Dashboard/WorkerDash/WithdrawRequest/WithdrawRequest";
import ManageUsers from "../Pages/Dashboard/AdminDash/ManageUsers/ManageUsers";
import ManageTasks from "../Pages/Dashboard/AdminDash/ManageTasks/ManageTasks";
import Forbidden from "../Pages/Forbidden/Forbidden";
import BuyerRoutes from "../Provider/BuyerRoutes";
import AdminRoutes from "../Provider/AdminRoutes";
import WorkerRoutes from "../Provider/WorkerRoutes";

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
            },
            {
                path:"forbidden",
                Component: Forbidden
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
                element: <BuyerRoutes><PuchaseCoin></PuchaseCoin></BuyerRoutes>
            },
            {
                path:"payment-history",
                element: <BuyerRoutes><PaymentHistory></PaymentHistory></BuyerRoutes>
            },
            {
                path: "add-task",
                element: <BuyerRoutes><AddTask></AddTask></BuyerRoutes>
            },
            {
                path: "my-tasks",
                element: <BuyerRoutes><MyTasks></MyTasks></BuyerRoutes>
            },
            // worker routes
            {
                path: "tasklist",
                element:<WorkerRoutes><TaskList></TaskList></WorkerRoutes>
            },
            {
                path: "my-submissions",
                element: <WorkerRoutes><MySubmissions></MySubmissions></WorkerRoutes>
            },
            {
                path:"withdrawals",
                element: <WorkerRoutes><WithdrawRequest></WithdrawRequest></WorkerRoutes>
            },
            // admin routes
            {
                path: "manage-users",
                element:<AdminRoutes><ManageUsers></ManageUsers></AdminRoutes>
            },
            {
                path: "manage-tasks",
                element: <AdminRoutes><ManageTasks></ManageTasks></AdminRoutes>
            }
        ]
    }
])