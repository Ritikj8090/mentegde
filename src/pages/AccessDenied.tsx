import { Link } from "react-router-dom";

const AccessDenied = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-100">
      <div className="max-w-2xl w-full text-center p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold text-red-600">Access Denied</h1>
        <p className="text-lg text-gray-700 mt-2">
          You do not have permission to view this page.
        </p>
      </div>
    </div>
  );
};

export default AccessDenied;
