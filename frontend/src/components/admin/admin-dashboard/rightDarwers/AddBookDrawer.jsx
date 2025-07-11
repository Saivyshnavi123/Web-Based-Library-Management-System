import React, { useEffect } from 'react';
import Drawer from '@mui/material/Drawer';
import { toast } from 'react-toastify';

export default function AddBookDrawer({
  open,
  onClose,
  newBook,
  handleInputChange,
  handleSubmit,
  error,
  success,
  isEdit = false
}) {
  useEffect(() => {
    if (success) toast.success(success);
    if (error) toast.error(error);
  }, [success, error]);

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div
        style={{
          width: 350,
          padding: "1.5rem",
          background: "#f5faff",
          height: "100%",
        }}
      >
        <h3 style={{ marginBottom: "1rem" }}>
          {isEdit ? "Edit Book" : "Add New Book"}
        </h3>
        <form onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Title"
            value={newBook.title}
            onChange={handleInputChange}
            style={{
              marginBottom: "1rem",
              width: "100%",
              padding: "0.5rem",
            }}
            required
          />
          <input
            name="author"
            placeholder="Author"
            value={newBook.author}
            onChange={handleInputChange}
            style={{
              marginBottom: "1rem",
              width: "100%",
              padding: "0.5rem",
            }}
            required
          />
          <input
            name="quantity"
            placeholder="Quantity"
            type="number"
            min="1"
            value={newBook.quantity}
            onChange={handleInputChange}
            style={{
              marginBottom: "1rem",
              width: "100%",
              padding: "0.5rem",
            }}
            required
          />
          <input
            name="file"
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            style={{
              marginBottom: "1rem",
              width: "100%",
              padding: "0.3rem",
            }}
            required={!isEdit}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <button
              type="submit"
              className="admin-card-btn"
              style={{ padding: "0.3rem 1rem" }}
            >
              {isEdit ? "Update" : "Add"}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "transparent",
                border: "none",
                color: "#888",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Drawer>
  );
}