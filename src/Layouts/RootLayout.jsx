import React from "react";
import Navbar from "../Pages/Shared/Navbar";
import Footer from "../Pages/Shared/Footer";
import { Outlet } from "react-router";

const RootLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header>
        <Navbar></Navbar>
      </header>
      <main className="flex-grow">
        <Outlet></Outlet>
      </main>
      <footer>
        <Footer></Footer>
      </footer>
    </div>
  );
};

export default RootLayout;
