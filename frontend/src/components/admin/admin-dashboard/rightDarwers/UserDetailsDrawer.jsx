import React, { useEffect, useState } from "react";
import { Drawer, CircularProgress } from "@mui/material";
import { apiGet } from "../../../../api/ApiProvider";

export default function UserDetailsDrawer({ open, onClose, userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && userId) {
      setLoading(true);
      apiGet(`/users/${userId}`)
        .then(data => setUser(data))
        .finally(() => setLoading(false));
    }
  }, [open, userId]);

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div style={{ width: 350, padding: 24, background: "#f5faff", height: "100%" }}>
        <h2>User Details</h2>
        {loading ? (
          <CircularProgress />
        ) : user ? (
          <div style={{ marginTop: 24 }}>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </div>
        ) : (
          <p>No user data.</p>
        )}
        <button
          style={{
            marginTop: 32,
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "0.5rem 1.2rem",
            cursor: "pointer"
          }}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </Drawer>
  );
}