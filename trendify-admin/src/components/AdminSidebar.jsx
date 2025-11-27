import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
  const linkClass =
    "block px-4 py-2 rounded-md text-gray-700 hover:bg-indigo-100 hover:text-indigo-600";

  const activeClass =
    "block px-4 py-2 rounded-md bg-indigo-600 text-white";

  return (
    <div className="w-64 h-screen bg-white border-r shadow-sm fixed">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-indigo-600">Trendify Admin</h1>
      </div>

      <nav className="p-4 space-y-2">
        <NavLink to="/admin" className={({ isActive }) => (isActive ? activeClass : linkClass)}>
          Dashboard
        </NavLink>

        <NavLink to="/admin/products" className={({ isActive }) => (isActive ? activeClass : linkClass)}>
          Products
        </NavLink>

        <NavLink to="/admin/add-product" className={({ isActive }) => (isActive ? activeClass : linkClass)}>
          Add Product
        </NavLink>

        <NavLink to="/admin/orders" className={({ isActive }) => (isActive ? activeClass : linkClass)}>
          Orders
        </NavLink>

        <NavLink to="/admin/users" className={({ isActive }) => (isActive ? activeClass : linkClass)}>
          Users
        </NavLink>
      </nav>
    </div>
  );
}
