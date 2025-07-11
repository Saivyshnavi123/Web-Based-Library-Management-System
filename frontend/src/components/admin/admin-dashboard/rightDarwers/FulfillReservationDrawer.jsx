import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import { apiPatch } from "../../../../api/ApiProvider";
import { toast } from "react-toastify";

export default function FulfillReservationDrawer({ open, onClose, reservation, userId, onFulfilled }) {
  const [loading, setLoading] = useState(false);

  const handleFulfill = async () => {
    setLoading(true);
    try {
      await apiPatch(`/reservations/${reservation?.reservation_id}/fulfill`, { user_id: userId });
      toast.success("Reservation fulfilled!");
      onFulfilled && onFulfilled();
      onClose();
    } catch {
      toast.error("Failed to fulfill reservation.");
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async () => {
    setLoading(true);
    try {
      await apiPatch(`/reservations/${reservation?.reservation_id}/return`, { user_id: userId });
      toast.success("Book Returned!");
      onFulfilled && onFulfilled();
      onClose();
    } catch {
      toast.error("Failed to return reservation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div style={{ width: 320, padding: 24 }}>
        <h3>Fulfill Reservation</h3>
        <p>Are you sure you want to fulfill reservation <b>#{reservation?.reservation_id}</b>?</p>
        {reservation?.status === "reserved" && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleFulfill}
          disabled={loading}
          fullWidth
          style={{ marginTop: 24 }}
        >
          {loading ? "Fulfilling..." : "Confirm Fulfill"}
        </Button>
        )}
        {reservation?.status === "fulfilled" && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleReturn}
          disabled={loading}
          fullWidth
          style={{ marginTop: 24 }}
        >
          {loading ? "Returning..." : "Confirm Return"}
        </Button>
        )}
        <Button
          variant="outlined"
          color="secondary"
          onClick={onClose}
          fullWidth
          style={{ marginTop: 12 }}
        >
          Cancel
        </Button>
      </div>
    </Drawer>
  );
}