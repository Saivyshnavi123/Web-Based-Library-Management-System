import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { apiGet, apiPost, apiPut, API_BASE_URL } from "../../../api/ApiProvider";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import AddBookDrawer from "./rightDarwers/AddBookDrawer";
import { FaPencilAlt } from "react-icons/fa";
import StudentCartButton from "./addCartbutton";
import { useOutletContext } from "react-router-dom";

export default function AdminCards() {
  const role = sessionStorage.getItem("role"); 
  const userId = sessionStorage.getItem("userid"); 


  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    quantity: "",
    file: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { books, setBooks } = useOutletContext();
  const [page, setPage] = useState(1);
  const pageSize = 4;

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setNewBook({ ...newBook, file: files[0] });
    } else {
      setNewBook({ ...newBook, [name]: value });
    }
  };

  const fetchBooks = async () => {
    try {
      const data = await apiGet("/books");
      setBooks(data);
    } catch (err) {
      setError("Failed to fetch books.");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const openAddDrawer = () => {
    setEditMode(false);
    setNewBook({ title: "", author: "", quantity: "", file: null });
    setShowForm(true);
    setSelectedBookId(null);
    setError("");
    setSuccess("");
  };

  const openEditDrawer = (book) => {
    setEditMode(true);
    setNewBook({
      title: book.title,
      author: book.author,
      quantity: book.quantity,
      file: null,
    });
    setShowForm(true);
    setSelectedBookId(book.id);
    setError("");
    setSuccess("");
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!newBook.title || !newBook.author || !newBook.quantity) {
      setError("Title, author, and quantity are required.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("title", newBook.title);
      formData.append("author", newBook.author);
      formData.append("quantity", newBook.quantity);
      if (newBook.file) {
        formData.append("file", newBook.file);
      }
      await apiPost("/books", formData);
      setSuccess("Book added successfully!");
      setNewBook({ title: "", author: "", quantity: "", file: null });
      setShowForm(false);
      fetchBooks();
      setPage(1);
    } catch (err) {
      setError("Failed to add book. Please try again.");
    }
  };

  const handleEditBook = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!newBook.title || !newBook.author || !newBook.quantity) {
      setError("Title, author, and quantity are required.");
      return;
    }
    try {
      const formData = new FormData();
    formData.append("title", newBook.title);
    formData.append("author", newBook.author);
    formData.append("quantity", newBook.quantity);
    formData.append("user_id", userId);
    if (newBook.file) {
      formData.append("file", newBook.file);
    }
      await apiPut(`/books/${selectedBookId}`, formData);
      setSuccess("Book updated successfully!");
      setNewBook({ title: "", author: "", quantity: "", file: null });
      setShowForm(false);
      setEditMode(false);
      setSelectedBookId(null);
      fetchBooks();
    } catch (err) {
      setError("Failed to update book. Please try again.");
    }
  };

  const pageCount = Math.ceil(books.length / pageSize);
  const paginatedBooks = books.slice((page - 1) * pageSize, page * pageSize);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <div className="admin-cards-container">
      <h2 className="admin-cards-title">Books List</h2>
      {/* Only show Add New Book if not user */}
      {role !== "student" && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "1rem",
          }}
        >
          <button
            className="admin-card-btn"
            style={{ padding: "0.4rem 1.2rem" }}
            onClick={openAddDrawer}
          >
            Add New Book
          </button>
        </div>
      )}

      <AddBookDrawer
        open={showForm}
        onClose={() => setShowForm(false)}
        newBook={newBook}
        handleInputChange={handleInputChange}
        handleSubmit={editMode ? handleEditBook : handleAddBook}
        error={error}
        success={success}
        isEdit={editMode}
      />

      {/* Book Cards List */}
      {paginatedBooks.length > 0 && (
        <>
          <div className="admin-cards-row" style={{ gap: "1rem" }}>
          {paginatedBooks.map((book) => (
  <div
    className="admin-card"
    key={book.id}
    style={{
      width: "180px",
      minWidth: "180px",
      margin: "0.5rem",
      boxShadow: "0 2px 8px #eee",
      borderRadius: "0.5rem",
      padding: "0.5rem",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "210px",
    }}
  >
    <div className="admin-card-body" style={{ padding: 0 }}>
      <img
        src={`${API_BASE_URL}${book?.image_url}`}
        alt="Mock Book"
        style={{
          width: "100%",
          height: "90px",
          objectFit: "cover",
          borderRadius: "0.5rem 0.5rem 0 0",
          marginBottom: "0.5rem",
        }}
            />
            <h5
        className="admin-card-title"
        style={{ fontSize: "0.95rem", margin: "0.2rem 0" }}
            >
        {book.title}
            </h5>
            <h6
        className="admin-card-subtitle"
        style={{ fontSize: "0.8rem", margin: "0.2rem 0" }}
            >
        Author: {book.author}
            </h6>
            <p
        className="admin-card-text"
        style={{ fontSize: "0.8rem", margin: "0.2rem 0" }}
            >
        Qty: <span className="admin-card-qty">{book.quantity}</span>
            </p>
          </div>
          {/* Show Add to Cart for students, Edit for others */}
{role === "student" ? (
  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "auto" }}>
    <StudentCartButton book={book} />
  </div>
) : (
  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "auto" }}>
    <button
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "#1976d2",
        fontSize: "1.1rem",
      }}
      title="Edit Book"
      onClick={() => openEditDrawer(book)}
    >
      <FaPencilAlt />
    </button>
  </div>
)}
  </div>
))}
          </div>
          {/* Pagination Controls */}
          <Stack spacing={2} sx={{ alignItems: "center", marginTop: 2 }}>
            <Pagination
              count={pageCount}
              page={page}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
              showFirstButton
              showLastButton
            />
          </Stack>
        </>
      )}
    </div>
  );
}