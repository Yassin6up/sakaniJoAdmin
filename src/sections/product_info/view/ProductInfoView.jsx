import axios from 'axios';
import moment from 'moment-timezone';
import { useEffect, useState } from 'react';
import ImageGallery from 'react-image-gallery';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';

import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import {
  Box,
  Grid,
  Container,
  Typography,
  Stack,
  IconButton,
} from '@mui/material';

import Iconify from 'src/components/iconify';

import ProductInfo from '../product-info';
import BookingListPopover from '../BookingListPopover';

export default function ProductInfoView() {
  const [booking, setBooking] = useState([]);
  const [products, setProducts] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [bookingInfoOpen, setBookingInfoOpen] = useState(false);
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const productId = searchParams.get('id');

  useEffect(() => {
    if (!productId) navigate('/404', { state: 300 });
  }, [productId, navigate]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://backend.sakanijo.com/admin/places/gat/${productId}`);
        const data = await response.json();
        setProducts(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProduct();
  }, [productId]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`https://backend.sakanijo.com/bookings/getTitles/${productId}`);
        const data = await response.json();
        setBooking(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };
    fetchBookings();
  }, [productId]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (item) => {
    setAnchorEl(null);
    navigate(`/Booking?id=${item.id}`);
  };

  const handleMenuClick = (event) => {
    setAnchorEl2(event.currentTarget);
    setOpenMenu(true);
  };

  const handleCloseMenu = () => {
    setAnchorEl2(null);
    setOpenMenu(false);
  };

  // const handleBookingOpen = () => {
  //   setBookingInfoOpen(true);
  //   handleCloseMenu();
  // };

  const handleBookingClose = () => {
    setBookingInfoOpen(false);
  };



  const handleDelete = async () => {
   const askDelete =  window.confirm("هل متاكد من حدف الاعلان")
   if(askDelete){
    try{
      const repsone = await axios.delete(`https://backend.sakanijo.com/places/${+productId}`) 
      if (repsone.status === 200) {
        alert('تم الحذف الاعلان')
         navigate ('/products');
      } 
  
    }
    catch(error) {
      console.log(error)
    }
   }
    
  }


    const handleApprove = async () => {
      try{
        const repsone = await axios.put(`https://backend.sakanijo.com/places/${+productId}/approve`) 
        if (repsone.status === 200) {
          setProducts({...products , approved : !products.approved})
         alert('تم التعديل بنجاح')
        } 
    
      }
      catch(error) {
        console.log(error)
      }
    
     
    
    // Implement your delete logic here
    console.log('Delete clicked');
    handleCloseMenu();
  };

  const open = Boolean(anchorEl);
  const id = open ? 'more-options-popover' : undefined;

  if (!products) navigate('/404', { state: 300 });
  const photos = products?.photos ? products.photos.split(',') : [];
  const allPhotos = photos.map(photo => ({
    original: `https://backend.sakanijo.com/api/images/${encodeURIComponent(products.folderName)}/${encodeURIComponent(photo)}`
  }));

  const coverView = (
    <Box
      borderRadius="10px"
      overflow="hidden"
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: 'cover',
        position: 'absolute',
      }}
    >
      <ImageGallery items={allPhotos} />
    </Box>
  );

  return (
    <Container
      style={{
        marginBottom: 300,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">{t('product_info_title_t')}</Typography>
        <IconButton aria-describedby={id} onClick={handleMenuClick}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Box sx={{ pt: '100%', position: 'relative' }}>{coverView}</Box>
        </Grid>
        <Grid item xs={8}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mt={2}
            width="100%"
          >
            <Typography variant="h4" textAlign="start" overflow="scroll" component="u">
              {products.title}
            </Typography>
            <Typography fontSize={20} mr={10}>
              {products.price} JOD
            </Typography>
          </Stack>
          <Grid container spacing={1} mt={2} ml={2} width="100%">
            <Grid item xs={12 / 3}>
              <ProductInfo name="Id" value={products.id} />
            </Grid>
            <Grid item xs={12 / 3}>
              <ProductInfo
                name={t('الحاله')}
                value={products.active ? t('نشط') : t('غير نشط ')}
                valueColor={products.active  ? 'success.main' : 'error.main'}
              />
            </Grid>
            <Grid item xs={12 / 3}>
              <ProductInfo name={t('طريقه البيع')} value={t(products.buy_or_rent)} />
            </Grid>
            <Grid item xs={4}>
              <ProductInfo
                name={t('موافقه')}
                value={products.approved ? 'مفعله' : 'غير مفعله'}
                valueColor={products.approved ? 'success.main' : 'warning.main'}
              />
            </Grid>
            <Grid item xs={4}>
              <ProductInfo name={t('العنوان')} value={products.address} />
            </Grid>
            <Grid item xs={4}>
              <ProductInfo name={t('المبلغ')} value={products.price} />
            </Grid>
            <Grid item xs={4}>
              <ProductInfo name={t('النوع')} value={products.home_type} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" component="span">
                {t('الوصف')}:{' '}
              </Typography>
              <Typography variant="body1" ml={1}>
                {products.description}
              </Typography>


          <a href={`tel:${products?.ownerPhone?.toString()}`}>
            <button className="button-3" type='button'>
              {products.ownerPhone}
            </button>
          </a>



          {
            products.poolDocument ? 
            <a download target='_blank' rel="noreferrer" href={`https://backend.sakanijo.com/api/images/${encodeURIComponent(
                    products.folderName
                  )}/${encodeURIComponent(products.poolDocument)}`}
            
            style={{
              textDecoration: 'none',
              color : "green" , 
              marginLeft : 20
            }}>
              تحميل رخصة المسبح
            </a>
            :
            null
          }
          
          {
            products.challetDocument? 
            <a download target='_blank' rel="noreferrer" href={`https://backend.sakanijo.com/api/images/${encodeURIComponent(
                    products.folderName
                  )}/${encodeURIComponent(products.challetDocument)}`}
            
            style={{
              textDecoration: 'none',
              color : "green" , 
              marginLeft : 20
            }}>
              تحميل رخصة الشليه
            </a>
            :
            null
          }




              <Button
                variant="contained"
                sx={{
                  backgroundColor: 'black',
                  color: 'white',
                  width: '100%',
                  '&:hover': {
                    backgroundColor: 'darkgrey',
                  },
                }}
                onClick={handleClick}
              >
                حجوزات الخاصه بالاعلان
              </Button>
              <Popover
                id="more-options-popover"
                open={openMenu}
                anchorEl={anchorEl2}
                onClose={handleCloseMenu}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
               <MenuItem onClick={handleApprove}>
                {products.approved ? 'ايقاف الاعلان' :'تفعيل الاعلان'}
                </MenuItem>
                <MenuItem onClick={handleDelete}>حذف</MenuItem>
              </Popover>

              <Popover
                id="more-options-popover"
                open={open}
                anchorEl={anchorEl}
                onClose={handleCloseMenu}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <Typography variant="h6" sx={{ p: 2 }}>
                  جميع الحجوزات بهذا العقار
                </Typography>
                <Box maxHeight={400} overflow="auto">
                  {booking.map((item) => (
                    <MenuItem
                      key={item.id}
                      onClick={() => { handleClose(item); }}
                      sx={{
                        borderBottom: '1px solid #ccc',
                        padding: '10px 16px',
                      }}
                    >
                      {moment.tz(item.checkIn, 'Asia/Amman').format('MMMM Do YYYY, h:mm:ss a')} من ;
                      {moment.tz(item.checkOut, 'Asia/Amman').format('MMMM Do YYYY, h:mm:ss a')} إلى ;
                    </MenuItem>
                  ))}
                  </Box>
                  </Popover>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                     
                      
                        <BookingListPopover open={bookingInfoOpen} onClose={handleBookingClose} />
                      </Container>
                    );

                   

                  }  

