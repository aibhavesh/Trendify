import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

export default function AdminLayout({ children }) {
  return (
    <div>
      <AdminSidebar />
      <AdminNavbar />
      <div className="ml-64 mt-16 p-6 bg-gray-50 min-h-screen">{children}</div>
    </div>
  );
}
