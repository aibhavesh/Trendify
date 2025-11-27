import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function AdminNavbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="h-16 bg-white border-b shadow-sm flex items-center justify-between px-6 ml-64">
      <h2 className="text-lg font-semibold text-gray-700">Admin Panel</h2>

      <div className="flex items-center gap-4">
        <span className="text-gray-600">{user?.name}</span>
        <button
          onClick={logout}
          className="px-4 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
