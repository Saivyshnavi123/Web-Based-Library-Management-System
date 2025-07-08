import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { apiPut } from "../../../../api/ApiProvider";
import { toast } from "react-toastify";

export default function UpdatePasswordDrawer({ open, onClose, userId, username ,onSuccess}) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!password) {
      toast.error("Password cannot be empty");
      return;
    }
    setLoading(true);
    try {
      await apiPut(`/users/${userId}`, { password, username });
      toast.success("updated successfully!");
      setPassword("");
      onClose();
      if (onSuccess) onSuccess(); 
    } catch {
      toast.error("Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setPassword("");
    onClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={handleCancel}>
      <div style={{ width: 320, padding: 24 }}>
        <h3>Update Password</h3>
        <TextField
          label="New Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdate}
          disabled={loading}
          fullWidth
          style={{ marginTop: 16 }}
        >
          {loading ? "Updating..." : "Update Password"}
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleCancel}
          fullWidth
          style={{ marginTop: 12 }}
        >
          Cancel
        </Button>
      </div>
    </Drawer>
  );
}