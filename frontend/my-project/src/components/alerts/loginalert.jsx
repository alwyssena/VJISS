import { useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TokenNotifier = () => {
  const hasNotified = useRef(false);

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      console.log("Checking token:", token);

      if (!token) {
        console.log("No token found");
        console.log("Has notified:", hasNotified.current);
        if (!hasNotified.current) {
          console.log("Showing toast...");
          toast.warning("You are not logged in!", {
            position: "top-right",
            autoClose: 3000,
            pauseOnHover: true,
            closeOnClick: true,
            draggable: true,
          });
        }
      } else {
        hasNotified.current = true;
      }
    };

    checkToken();
    const interval = setInterval(checkToken, 11000);

    return () => clearInterval(interval);
  }, []);

  return <ToastContainer />;
};

export default TokenNotifier;
