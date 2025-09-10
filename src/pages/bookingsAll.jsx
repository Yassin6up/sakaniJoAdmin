import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, CardMedia, CardActions, Typography, 
  Button, Select, MenuItem, Grid, Container, Box, FormControl, InputLabel 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const statusMapping = {
  Pending: 'قيد المراجعة',
  Passed: 'تم القبول',
  Rejected: 'مرفوض',
};

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate(); // ✅ Use navigate for redirection

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('https://backend.sakanijo.com/get-all-bookings');
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error('حدث خطأ أثناء جلب البيانات:', error);
      }
    };

    fetchBookings();
  }, []);

  // تصفية الحجوزات حسب الحالة
  const filteredBookings = statusFilter 
    ? bookings.filter(booking => booking.status === statusFilter)
    : bookings;

  return (
    <Container maxWidth="lg" dir="rtl"> {/* 🔹 إضافة dir="rtl" لتوجيه النصوص */}
      {/* قسم التصفية */}
      <Box my={3} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" fontWeight="bold" textAlign="right">📌 جميع الحجوزات</Typography>
        <FormControl size="small">
          <InputLabel>حالة الحجز</InputLabel>
          <Select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)} 
            label="حالة الحجز"
            sx={{ width: '200px' }} // Add pointer cursor

          >
            <MenuItem value="">الكل</MenuItem>
            <MenuItem value="Pending">قيد المراجعة</MenuItem>
            <MenuItem value="Passed">تم القبول</MenuItem>
            <MenuItem value="Rejected">مرفوض</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* عرض الحجوزات */}
      <Grid container spacing={3}>
        {filteredBookings.map(booking => (
          <Grid item xs={12} sm={6} md={4} key={booking.id}>
            <Card sx={{ borderRadius: 3, boxShadow: 3, textAlign: 'right' }}> {/* 🔹 نصوص داخل الكارد إلى اليمين */}
              <CardMedia
                component="img"
                height="200"
                image={`https://backend.sakanijo.com/api/images/${encodeURIComponent(booking.folderName)}/${encodeURIComponent(booking?.photos)}` }
                alt={booking.placeTitle}
                sx={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
              />
              <CardContent>
                <Typography variant="h6" fontWeight="bold" 
                sx={{ cursor: 'pointer' }} // Add pointer cursor
                onClick={()=>{
                    navigate(`/product_info?id=${booking.placeId}`)
                }}
                >{booking.placeTitle}</Typography>
                <Typography variant="body2" color="textSecondary">
                  🏠 اسم الزبون: {booking.userName} 
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  📞 رقم الزبون : {booking.phone}
                </Typography>
                <Typography variant="body2">🏡 نوع العقار: {booking.type}</Typography>
                {/* <Typography variant="body2">🛏️ الغرف: {booking.rooms}</Typography> */}
                <Typography variant="body2">📅 المدة: {booking.duration +1} أيام</Typography>
                <Typography variant="body2">📆 التاريخ: {booking.date}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  ⏳ الحالة: {statusMapping[booking.status] || 'غير معروف'}
                </Typography>
              </CardContent>
              {/* <CardActions sx={{ justifyContent: 'flex-start' }}>
                <Button size="small" variant="contained" color="primary">📄 تفاصيل</Button>
                <Button size="small" variant="outlined" color="error">❌ إلغاء</Button>
              </CardActions> */}
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* في حالة عدم وجود حجوزات */}
      {filteredBookings.length === 0 && (
        <Box mt={4} textAlign="center">
          <Typography variant="h6" color="textSecondary">لا توجد حجوزات بهذه الحالة.</Typography>
        </Box>
      )}
    </Container>
  );
};

export default Bookings;
