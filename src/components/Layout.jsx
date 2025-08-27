import { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  Ship,
  Fuel,
  Waves,
  Truck,
  BarChart3,
  Users,
  FileText,
  LogOut,
  Menu,
  X,
  Package,
  Settings,
  Activity,
  ClipboardMinus,
  AlignJustify,
} from "lucide-react";

import LanguageSwitcher from "./LanguageSwitcher";
import { useAuthStore } from "../store/auth";
import { useShipsStore } from "../store/ships";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { type, logout, user } = useAuthStore();
  const { currentShip } = useShipsStore();
  

  //console.log(currentShip)

  const id = user.id;

  const adminNavigation = [
    { name: "Tableau de bord", href: "/", icon: BarChart3 },
    { name: "Navires", href: `/ships`, icon: Ship },
    { name: "Gasoil", href: `/fuel`, icon: Fuel },
    { name: "Surfers", href: `/surfers`, icon: Waves },
    { name: "Transport terrestre", href: `/transport`, icon: Truck },
    { name: "Rapports", href: `/reports`, icon: FileText },
    { name: "Utilisateurs", href: "/users", icon: Users },
  ];

  const shipNavigation = [
    { name: "My Vessel", href: `/ship-dashboard/${id}`, icon: Ship },
    { name: "Daily Report", href: `/ship-form/${id}`, icon: AlignJustify },
    {
      name: "Report History",
      href: `/ship-reports/${id}`,
      icon: ClipboardMinus,
    },
    { name: "Gasoil", href: `/ship-fuel/${id}`, icon: Fuel },
    { name: "Cargo", href: `/ship-cargo/${id}`, icon: Package },
    { name: "Maintenance", href: `/ship-maintenance/${id}`, icon: Settings },
  ];

  const navigation = type === "admin" ? adminNavigation : shipNavigation;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      {type != "admin" && (
        <div
          className={`fixed inset-0 z-50 lg:hidden ${
            sidebarOpen ? "block" : "hidden"
          }`}
        >
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h1 className="text-xl font-bold text-blue-900">PERENCO Log</h1>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="mt-4">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      {type != "admin" && (
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
          <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
            <div className="flex items-center px-4 py-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-orange-500 rounded-lg flex items-center justify-center">
                  <Ship className="h-5 w-5 text-white" />
                </div>
                <h1 className="ml-3 text-xl font-bold text-gray-900">
                  PERENCO Log
                </h1>
              </div>
            </div>
            <nav className="mt-6 flex-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </NavLink>
              ))}
            </nav>
            <div className="p-4">
              <LanguageSwitcher />
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      <Ship className="h-5 w-5 text-gray-700" />
                      {/* {currentShip.small_name} */}
                      {/* {userType === "admin"
                      ? user?.email?.charAt(0).toUpperCase()
                      : ship?.name?.charAt(0).toUpperCase()} */}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">
                      {currentShip?.small_name}
                      {/* {userType === "admin" ? user?.name : ship?.name} */}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {currentShip?.captain}
                      {/* {userType === "admin" ? user?.role : ship?.captain} */}
                    </p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className={type != "admin" ? "lg:pl-64" : ""}>
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">OpéraLog</h1>
            <button
              onClick={logout}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
