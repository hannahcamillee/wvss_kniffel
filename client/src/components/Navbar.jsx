// client/src/components/Navbar.jsx

import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import Modal from "./Modal";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const [modalMessage, setModalMessage] = useState(null);

  const closeModal = () => setModalMessage(null);

  // Logs out the user by calling backend logout endpoint, resets user state, and navigates home.
  const handleLogout = async () => {
    try {
      await axios.post(
      "http://localhost:3001/api/logout",
      {},
      { withCredentials: true }
    );
    setUser(null);
    navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      if(error.response?.data?.error) {
        setModalMessage(`Error: ${error.response.data.error}`);
      } else {
        setModalMessage("There was an error logging out. Please try again later.");
      }
    }
  }

  // Deletes the user account after confirmation, logs out, and shows success or error modal.
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if(!confirmDelete) return;

    try {
      // delete account on backend
      await axios.delete("http://localhost:3001/api/user/", {
        withCredentials: true,
      });

      // Log out after deletion
      await handleLogout();

      setModalMessage("Your account has been deleted successfully.");
    } catch (error) {
      console.error("Error deleting account:", error);
      if(error.response?.data?.error) {
        setModalMessage(`Error: ${error.response.data.error}`);
      } else {
        setModalMessage("There was an error deleting your account. Please try again later.");
      }
    }
  }

  return (
    <>
      <nav className="w-full text-black dark:text-white bg-white dark:bg-gray-900 shadow dark:shadow-lg px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          <Link to="/" className="hover:text-gray-600 dark:hover:text-gray-300">
            Kniffel App
          </Link>
        </h1>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-gray-700 dark:text-gray-300">Hi, {user.username}</span>
              <Link to="/kniffel" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500">
                Play
              </Link>
              <Link to="/dashboard" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500">
                Dashboard
              </Link>
              <Link to="/rules" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500">
                Rules
              </Link>

              <button onClick={handleLogout} className="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-600">
                Logout
              </button>
              <button
                onClick={handleDeleteAccount}
                className="text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-600 rounded-md inline-flex flex-col items-center justify-center"
                style={{
                  padding: ".25rem .5rem",
                  fontSize: ".75rem",
                  backgroundColor: "transparent",
                  border: "none",
                  fontWeight: "normal",
                  cursor: "pointer",
                  lineHeight: "1rem",
                  transform: "translateY(-2px)",
                }}
              >
                Delete <br />
                Account
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500">
                Login
              </Link>
              <Link to="/register" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
      <Modal message={modalMessage} onClose={closeModal} />
    </>
  );
}
