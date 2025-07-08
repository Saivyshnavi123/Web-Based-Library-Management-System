import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet, apiDelete } from "../../../api/ApiProvider";
import { toast } from "react-toastify";
import { FaEye } from "react-icons/fa";
import UserDetailsDrawer from "../admin-dashboard/rightDarwers/UserDetailsDrawer"; 
import "react-toastify/dist/ReactToastify.css";

export default function AdminUsersList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [detailsUser, setDetailsUser] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await apiGet("/users");
        setUsers(data);
      } catch {
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);

  const openDeleteDialog = (id) => {
    setDeleteUserId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await apiDelete(`/users/${deleteUserId}`);
      setUsers(users.filter(user => user.id !== deleteUserId));
      toast.success("User deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete user.");
    }
    setDeleteDialogOpen(false);
    setDeleteUserId(null);
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setDeleteUserId(null);
  };

  return (
    <div className="users-table-container">
      <h2 className="users-table-title">Users List</h2>
      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th></th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>
                <FaEye
                  style={{ cursor: "pointer", color: "#1976d2" }}
                  title="View Details"
                  onClick={() => {
                    setDetailsUser(user.id);
                    setDetailsDrawerOpen(true);
                  }}
                />
              </td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button
                  className="users-table-btn delete"
                  onClick={() => openDeleteDialog(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <UserDetailsDrawer
        open={detailsDrawerOpen}
        onClose={() => setDetailsDrawerOpen(false)}
        userId={detailsUser}
      />

      {deleteDialogOpen && (
        <div className="delete-dialog-backdrop">
          <div className="delete-dialog-box">
            <h3>Are you sure you want to delete this user?</h3>
            <div className="delete-dialog-actions">
              <button
                className="users-table-btn delete"
                onClick={confirmDelete}
                style={{ minWidth: 80 }}
              >
                Confirm
              </button>
              <button
                className="users-table-btn"
                onClick={cancelDelete}
                style={{ minWidth: 80 }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}