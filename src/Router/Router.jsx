import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Authentication/Login";
import Register from "../Pages/Authentication/Register";

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
            }
        ]
    }
])