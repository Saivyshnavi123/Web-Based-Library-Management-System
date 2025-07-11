import React, { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { toast } from "react-toastify";
import AddCartDialog from "../admin-dashboard/rightDarwers/AddCartDialog";

export default function StudentCartButton({ book, onCartChange }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    const checkCart = () => {
      const cart = JSON.parse(sessionStorage.getItem("studentCart") || "[]");
      setIsInCart(cart.some((item) => item.book_id === book.id));
    };
    checkCart();
    window.addEventListener("cartUpdated", checkCart);
    return () => window.removeEventListener("cartUpdated", checkCart);
  }, [book.id]);

  const handleAddToCart = (quantity) => {
    const cart = JSON.parse(sessionStorage.getItem("studentCart") || "[]");
    if (cart.find((item) => item.book_id === book.id)) {
      toast.info("Book already in cart!");
      setDialogOpen(false);
      return;
    }
    const updatedCart = [
      ...cart,
      { book_id: book.id, quantity, title: book.title, author: book.author, maxQuantity: book.quantity }
    ];
    sessionStorage.setItem("studentCart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Book added to cart!");
    setDialogOpen(false);
    setIsInCart(true);
    if (onCartChange) onCartChange(updatedCart);
  };

  return (
    <>
      <button
        style={{
          background: isInCart ? "#aaa" : "#1976d2",
          border: "none",
          cursor: isInCart ? "not-allowed" : "pointer",
          color: "#fff",
          fontSize: "1.1rem",
          borderRadius: "0.3rem",
          padding: "0.3rem 0.7rem",
          marginLeft: "0.5rem",
          opacity: isInCart ? 0.7 : 1,
        }}
        title={isInCart ? "Already in cart" : "Add to Cart"}
        onClick={() => !isInCart && setDialogOpen(true)}
        disabled={isInCart}
      >
        <FaShoppingCart style={{ marginRight: 4 }} />
        {isInCart ? "In Cart" : "Add to Cart"}
      </button>
      <AddCartDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAdd={handleAddToCart}
        maxQuantity={book.quantity}
      />
    </>
  );
}