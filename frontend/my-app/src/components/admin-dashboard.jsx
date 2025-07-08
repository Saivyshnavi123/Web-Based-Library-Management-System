import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import Navbar from "../../../global/navbar/navbar";

export default function Dashboard() {
  const role = sessionStorage.getItem("role");
  const username = sessionStorage.getItem("username");
  const [books, setBooks] = useState([]);

  return (
    <div>
      <Navbar username={username} role={role} onBooksUpdate={setBooks} />
      <div className="dashboard-container">
        <aside className="dashboard-menu">
          <NavLink
            to="cards"
            className={({ isActive }) =>
              isActive ? "dashboard-link active" : "dashboard-link"
            }
          >
            Books
          </NavLink>
          {role === "librarian" && (
            <>
              <NavLink
                to="usersList"
                className={({ isActive }) =>
                  isActive ? "dashboard-link active" : "dashboard-link"
                }
              >
                Users
              </NavLink>
              <NavLink
                to="reservations"
                className={({ isActive }) =>
                  isActive ? "dashboard-link active" : "dashboard-link"
                }
              >
                Reservations
              </NavLink>
            </>
          )}
          {role === "student" && (
            <NavLink
              to="MyReservations"
              className={({ isActive }) =>
                isActive ? "dashboard-link active" : "dashboard-link"
              }
            >
              My Reservations
            </NavLink>
          )}
        </aside>
        <main className="dashboard-content">
          <Outlet context={{ books, setBooks }} />
        </main>
      </div>
    </div>
  );
}