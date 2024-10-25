import { useSearchParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import { Button, Card, CardContent, CardActions, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const BookingCard = () => {
  const [booking, setBooking] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('id');

  useEffect(() => {
    const fetchBooking = async () => {
      if (bookingId) {
        try {
          const response = await fetch(`https://backend.sakanijo.com/api/bookings/get/${bookingId}`);
          const data = await response.json();
          setBooking(data);
          console.log(data);
        } catch (error) {
          console.error('Error fetching booking:', error);
        }
      }
    };

    fetchBooking();
  }, [bookingId]);

  const handleCancel = () => {
    setIsDeleted(true);
    console.log('Booking canceled');
  };

  const handleConfirm = () => {
    setShowConfirmation(true);
    console.log('Booking confirmed');
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  if (isDeleted) {
    return null;
  }

  if (!booking) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '70vh',
      }}
    >
      <Typography
        variant="h4"
        component="div"
        sx={{
          marginBottom: '1rem',
          fontWeight: 'bold',
        }}
      >
        Booking Details
      </Typography>
      <Card
        sx={{
          width: 400,
          boxShadow: 3,
          margin: '0 auto',
          borderRadius: '8px',
          backgroundColor: '#fff',
        }}
      >
        <CardContent>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <div
              style={{
                flex: 1,
                padding: '0 1rem',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Customer
              </Typography>
              <Typography>Name: {booking.name}</Typography>
              <Typography>Phone: {booking.phone}</Typography>
            </div>
            <div
              style={{
                flex: 1,
                padding: '0 1rem',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Place
              </Typography>
              <Typography>Title: {booking.place?.title || 'N/A'}</Typography>
              <Typography>Address: {booking.place?.address || 'N/A'}</Typography>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <div
              style={{
                flex: 1,
                padding: '0 1rem',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Price
              </Typography>
              <Typography>{booking.price} JOD</Typography>
            </div>
            <div
              style={{
                flex: 1,
                padding: '0 1rem',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Booking Period
              </Typography>
              <Typography>
                {new Date(booking.check_in).toLocaleDateString()} - {new Date(booking.check_out).toLocaleDateString()}
              </Typography>
            </div>
          </div>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            color="error"
            onClick={handleCancel}
            sx={{
              marginRight: '1rem',
              textTransform: 'none',
              borderRadius: '4px',
              backgroundColor: '#f44336',
              color: '#fff',
            }}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleConfirm}
            sx={{
              textTransform: 'none',
              borderRadius: '4px',
              backgroundColor: '#4caf50',
              color: '#fff',
            }}
          >
            Confirm Booking
          </Button>
        </CardActions>
      </Card>

      <Dialog open={showConfirmation} onClose={handleCloseConfirmation}>
        <DialogTitle
          sx={{
            fontSize: '1.5rem',
          }}
        >
          Confirm Booking
        </DialogTitle>
        <DialogContent
          sx={{
            padding: '20px',
          }}
        >
          <Typography>Are you sure you want to confirm this booking?</Typography>
        </DialogContent>
        <DialogActions
          sx={{
            padding: '10px',
          }}
        >
          <Button
            onClick={handleCloseConfirmation}
            color="secondary"
          >
            Close
          </Button>
          <Button
            onClick={() => {
              handleCloseConfirmation();
              // Confirm booking logic here
            }}
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BookingCard;
