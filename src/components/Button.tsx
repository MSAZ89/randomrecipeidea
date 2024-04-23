import React from "react";

// Define the types for the props the component accepts
interface ButtonProps {
  children: React.ReactNode; // Define the children prop to accept any valid React node
  onClick: () => void; // Define the onClick prop as a function that returns void
}

const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-green-500 hover:bg-green-700 text-white font-bold my-2 py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
    >
      {children}
    </button>
  );
};

export default Button;
