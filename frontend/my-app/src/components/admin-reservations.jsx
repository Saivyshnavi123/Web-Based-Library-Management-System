import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { apiGet } from "../../../api/ApiProvider";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import FulfillReservationDrawer from "./rightDarwers/FulfillReservationDrawer";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";

export default function AdminReservations() {
  const role = sessionStorage.getItem("role");
  const userId = sessionStorage.getItem("userid");
  const navigate = useNavigate();

  const [reservations, setReservations] = useState([]);
  const [fulfillDrawerOpen, setFulfillDrawerOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 4;

  const refreshReservations = async () => {
    try {
      const data = await apiGet(`/reservations?user_id=${userId}`);
      setReservations(data);
    } catch {
      setReservations([]);
    }
  };

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await apiGet(`/reservations?user_id=${userId}`);
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
      <h2 className="reservation-cards-title">Reservations List</h2>
      {paginatedReservations.length > 0 ? (
        <>
          <div className="reservation-cards-row">
            {paginatedReservations.map((reservation) => (
              <div className="reservation-card" key={reservation.reservation_id}>
                <div className="reservation-card-body">
                  <h5 className="reservation-card-title">
                    Book: {reservation.book}
                  </h5>
                  <p className="reservation-card-text">
                    Quantity: <span className="reservation-card-qty">{reservation.quantity}</span>
                  </p>
                  <p className="reservation-card-text">
                    Reservation ID: {reservation.reservation_id}
                  </p>
                  <p className="reservation-card-text">
                    Status: {reservation.status}
                  </p>
                  <p className="reservation-card-text">
                    Student: {reservation.student}
                  </p>
                  {reservation?.status === "reserved" && (
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    style={{ marginTop: 8 }}
                    onClick={() => {
                      setSelectedReservation(reservation);
                      setFulfillDrawerOpen(true);
                    }}
                  >
                    Fulfill
                  </Button>
                  )}
                  {reservation?.status === "fulfilled" && (
                  <Button
                    variant="contained"
                    size="small"
                    style={{ marginTop: 8, backgroundColor: "red",color: "white" }}
                    onClick={() => {
                      setSelectedReservation(reservation);
                      setFulfillDrawerOpen(true);
                    }}
                  >
                    Return
                  </Button>
                  )}
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
          <FulfillReservationDrawer
            open={fulfillDrawerOpen}
            onClose={() => setFulfillDrawerOpen(false)}
            reservation={selectedReservation}
            userId={userId}
            onFulfilled={refreshReservations}
          />
        </>
      ) : (
        <div style={{ marginTop: "2rem", textAlign: "center" }}>No reservations found.</div>
      )}
    </div>
  );
}