import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";

export default function AddCartDialog({ open, onClose, onAdd, maxQuantity }) {
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    if (quantity < 1 || quantity > maxQuantity) return;
    onAdd(quantity);
    setQuantity(1);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Select Quantity</DialogTitle>
      <DialogContent>
        <TextField
          type="number"
          label="Quantity"
          value={quantity}
          onChange={e => setQuantity(Number(e.target.value))}
          inputProps={{ min: 1, max: maxQuantity }}
          fullWidth
        />
        <div style={{ fontSize: 12, color: "#888", marginTop: 8 }}>
          Available: {maxQuantity}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleAdd}
          disabled={quantity < 1 || quantity > maxQuantity}
          variant="contained"
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}