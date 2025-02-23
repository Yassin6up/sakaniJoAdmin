import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, Divider } from '@mui/material';
import PropTypes from 'prop-types';

// Modal component for updating user data
const UpdateUserModal = ({ open, onClose, userData, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: ''
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        phone: userData.phone || '',
        password: ''
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    onUpdate(formData);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          direction: 'rtl' // Set direction to RTL
        }}
        dir="rtl" // RTL layout
      >
        <Typography variant="h6" gutterBottom>
          تحديث معلومات المستخدم
        </Typography>

        {/* Form Inputs */}
        <TextField
          label="الاسم"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="الهاتف"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="كلمة المرور"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />

        <Divider sx={{ my: 2 }} />

        {/* User Info Section */}
        <Typography variant="body2" gutterBottom>
          <strong>عدد المنشورات:</strong> {userData.postsCount}
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>عدد الحجوزات:</strong> {userData.bookingsCount}
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>عدد المفضلات:</strong> {userData.favoritesCount}
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>تاريخ الانضمام:</strong> {new Date(userData.joinedDate).toLocaleDateString('ar-EG')}
        </Typography>

        {/* Submit Button */}
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
          >
            تحديث
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};




UpdateUserModal.propTypes = {
    open: PropTypes.any,
    onClose :  PropTypes.any,
    userData :  PropTypes.any,
    onUpdate : PropTypes.any,

  };


export default UpdateUserModal;
