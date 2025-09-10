import React, { useEffect, useState } from 'react';
import { Typography, Paper, Grid, Avatar, Button, Box, Card, CardMedia, CardContent, Chip } from '@mui/material';
import axios from 'axios';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Create an RTL theme for Arabic language
const rtlTheme = createTheme({
  direction: 'rtl', // Right-to-left direction
});

const ProfileInfoPage = () => {
  const navigation = useNavigate()
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get the userId from query parameters
  const queryParams = new URLSearchParams(window.location.search);
  const userId = queryParams.get('userId');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userId) {
          throw new Error('معرف المستخدم مفقود.');
        }

        const response = await axios.get(`https://backend.sakanijo.com/user/${userId}`, {
          headers: { Authorization: `Bearer ${1}` }, // Replace MyId with your actual token
        });

        setUserData(response.data);
      } catch (err) {
        setError(err.message || 'فشل في استرداد بيانات المستخدم.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) return <Typography>جارٍ التحميل...</Typography>;
  if (error) return <Typography>خطأ: {error}</Typography>;

  if (!userData) return null;

  const { name, image_name,  picture_url, description, followersCount, followingCount, places } = userData;

  return (
    <ThemeProvider theme={rtlTheme}>
      <Grid container spacing={3} sx={{ padding: '20px' }}>
        {/* Profile Header */}
        <Grid item xs={12}>
        <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
            {/* Center the avatar using Box with flexbox */}
            <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
              <Avatar
                alt={name}
                src={ +picture_url === 100 ? `https://backend.sakanijo.com/api/images/profiles/${encodeURIComponent(image_name)}` : null}
                sx={{ width: 150, height: 150, mb: 2 }}
              />
              <Typography variant="h4">{name}</Typography>
              <Typography variant="subtitle1">{description}</Typography>
              <Box sx={{ mt: 2 }}>
                <Chip label={`المتابعين: ${followersCount}`} color="primary" sx={{ mr: 1 }} />
                <Chip label={`يتابع: ${followingCount}`} color="secondary" />
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Posts Section */}
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
            المنشورات
          </Typography>
          <Grid container spacing={2} 
          
          >
            {places.map((item) => {
              const photos = item.photos ? item.photos.split(',') : [];
              const imageUrl = photos.length > 0
                ? `https://backend.sakanijo.com/api/images/${encodeURIComponent(item.folderName)}/${encodeURIComponent(photos[0])}`
                : null;

              return (
                <Grid item xs={12} sm={6} md={4} key={item.id}
                onClick={()=>{
                  navigation(`/product_info?id=${item.id}`)
                }}
                sx={{ cursor: 'pointer' }} 
                >
                  <Card elevation={3} >
                    <CardMedia
                      component="img"
                      height="180"
                      image={imageUrl || '/default-image.jpg'} // Provide a default image if no photo exists
                      alt={item.title}
                    />
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.address}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          label={item.buy_or_rent === 'للبيع' ? 'للبيع' : 'إيجار'}
                          color={item.buy_or_rent === 'للبيع' ? 'primary' : 'secondary'}
                          sx={{ mr: 1 }}
                        />
                        {item.sponsored === 1 && (
                          <Chip label="مُموَّل" color="success" />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default ProfileInfoPage;