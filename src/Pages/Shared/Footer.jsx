import React from "react";
import {
  Facebook,
  Linkedin,
  Github,
  Mail,
  Phone,
} from "lucide-react";
import logo from "../../assets/WorkHiveLogo.png";

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white px-4 py-12 mt-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Logo + About */}
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <img src={logo} alt="WorkHive Logo" className="w-12 h-12" />
            <h2 className="text-2xl font-bold">WorkHive</h2>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            WorkHive is a micro-task and earning platform connecting task
            providers and workers worldwide — fast, fair, and efficient.
          </p>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <Mail size={16} /> support@workhive.com
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} /> +880 1234 567 890
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex space-x-5 text-white">
            <a
              href="https://www.facebook.com/Ibrahim376146ab/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-400 transition"
            >
              <Facebook size={22} />
            </a>
            <a
              href="https://www.linkedin.com/in/mohammad-ibrahim-abdullah/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-400 transition"
            >
              <Linkedin size={22} />
            </a>
            <a
              href="https://github.com/your-username"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-400 transition"
            >
              <Github size={22} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="text-center text-gray-400 text-sm mt-10 border-t border-blue-800 pt-6">
        © {new Date().getFullYear()} WorkHive. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
