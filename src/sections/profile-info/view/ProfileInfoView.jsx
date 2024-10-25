import React from 'react';
import { Typography, Paper } from '@mui/material';

import profile from "../profile.jpg";

const ProfileInfoPage = () => {
  const profileImageStyle = {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
  };

  const profileContainerStyle = {
    padding: '20px',
    width: '100%',
    maxWidth: '600px',
    margin: '20px auto',
    textAlign: 'center',
  };

  return (
    <Paper elevation={3} style={profileContainerStyle}>
      <img src={profile} alt="User Profile" style={profileImageStyle} />
      <Typography variant="h5" sx={{ mt: 2 }}>
        الاسم: محمد علي
      </Typography>
      <Typography variant="body1">
        رقم الهاتف: 01939838383
      </Typography>
      <Typography variant="body1">
        حالة المستخدم: نشط
      </Typography>
      <Typography variant="body1">
        عدد الحجوزات: 3
      </Typography>
      <Typography variant="body1">
        تاريخ إنشاء الحساب: 12/9/2024
      </Typography>
    </Paper>
  );
};

export default ProfileInfoPage;
