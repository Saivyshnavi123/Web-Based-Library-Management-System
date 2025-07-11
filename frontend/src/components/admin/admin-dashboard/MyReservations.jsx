import React, { useState, useEffect } from "react";
import { apiGet } from "../../../api/ApiProvider";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

export default function MyReservations() {
  const userId = sessionStorage.getItem("userid");
  const [reservations, setReservations] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 4;

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await apiGet(`/reservations/user/${userId}`);
        setReservations(data);
      } catch {
        setReservations([]);
      }
    };
    fetchReservations();
  }, [userId]);

  const safeReservations = Array.isArray(reservations) ? reservations : [];
  const pageCount = Math.ceil(safeReservations.length / pageSize);
  const paginatedReservations = safeReservations.slice((page - 1) * pageSize, page * pageSize);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <div className="reservation-cards-container">
      <h2 className="reservation-cards-title">My Reservations</h2>
      {paginatedReservations.length > 0 ? (
        <>
          <div className="reservation-cards-row">
            {paginatedReservations?.map((reservation) => (
              <div className="reservation-card" key={reservation.reservation_id}>
                <div className="reservation-card-body">
                  <h5 className="reservation-card-title">
                    Book: {reservation.book_title}
                  </h5>
                  <p className="reservation-card-text">
                    Quantity: <span className="reservation-card-qty">{reservation.quantity}</span>
                  </p>
                  <p className="reservation-card-text">
                    Reservation ID: {reservation.reservation_id}
                  </p>
                  <p className="reservation-card-text">
                  Status: <span style={{ fontWeight: "bold" }}>{reservation.status}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
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
      ) : (
        <div style={{ marginTop: "2rem", textAlign: "center" }}>No reservations found.</div>
      )}
    </div>
  );
}