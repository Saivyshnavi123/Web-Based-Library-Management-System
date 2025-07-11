import React, { useState, useEffect } from "react";
import { Drawer, IconButton, List, ListItem, ListItemText, Button, TextField } from "@mui/material";
import { apiPost ,apiGet} from "../../../../api/ApiProvider";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";

export default function CartDrawer({ open, onClose ,onBooksUpdate}) {
  const [cart, setCart] = useState([]);
  const userId = sessionStorage.getItem("userid");

  useEffect(() => {
    setCart(JSON.parse(sessionStorage.getItem("studentCart") || "[]"));
  }, [open]);

  const handleRemove = (book_id) => {
    const updated = cart.filter((item) => item.book_id !== book_id);
    setCart(updated);
    sessionStorage.setItem("studentCart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const hasInvalidQuantity = cart.some(
    (item) => item.quantity > (item.maxQuantity || 99) || item.quantity < 1
  );

  const handleQuantityChange = (book_id, quantity, max) => {
    if (quantity < 1 || quantity > max) {
      toast.error(`Quantity must be between 1 and ${max}`);
      return;
    }
    const updated = cart.map((item) =>
      item.book_id === book_id ? { ...item, quantity } : item
    );
    setCart(updated);
    sessionStorage.setItem("studentCart", JSON.stringify(updated));
  };

  const handleReserve = async () => {
    try {
      await apiPost("/reserve", { books: cart, user_id: Number(userId) });
      toast.success("Books reserved successfully!");
      setCart([]);
      sessionStorage.removeItem("studentCart");
      window.dispatchEvent(new Event("cartUpdated"));
      onClose();
      setTimeout(async () => {
        const updatedBooks = await apiGet("/books");
        if (onBooksUpdate) onBooksUpdate(updatedBooks);
      }, 1200);
    } catch {
      toast.error("Failed to reserve books.");
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div style={{ width: 350, padding: 20 }}>
        <h3>Your Cart</h3>
        <List>
  {cart.length === 0 && <div>No books in cart.</div>}
  {cart.map((item) => (
    <ListItem key={item.book_id} secondaryAction={
      <IconButton edge="end" onClick={() => handleRemove(item.book_id)}>
        <FaTrash />
      </IconButton>
    }>
      <ListItemText
        primary={
          <>
            <span className="cart-book-title">{item.title}</span>
            <span className="cart-book-author"> by {item.author}</span>
          </>
        }
        secondary={
          <TextField
            type="number"
            label="Quantity"
            value={item.quantity}
            onChange={e =>
              handleQuantityChange(
                item.book_id,
                Number(e.target.value),
                item.maxQuantity || 99
              )
            }
            inputProps={{
              min: 1,
              max: item.maxQuantity || 99
            }}
            style={{ width: 80 }}
            error={item.quantity > (item.maxQuantity || 99)}
            helperText={
              item.quantity > (item.maxQuantity || 99)
                ? `Max: ${item.maxQuantity || 99}`
                : ""
            }
          />
        }
      />
    </ListItem>
  ))}
</List>
        {cart.length > 0 && (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleReserve}
            style={{ marginTop: 16 }}
            disabled={hasInvalidQuantity}
          >
            Confirm Reserve
          </Button>
        )}
      </div>
    </Drawer>
  );
}