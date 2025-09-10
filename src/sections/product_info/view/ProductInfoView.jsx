import axios from 'axios';
import moment from 'moment-timezone';
import { useEffect, useState } from 'react';
import ImageGallery from 'react-image-gallery';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
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
import { motion } from 'framer-motion';

import Iconify from 'src/components/iconify';
import ShareButton from "../ShareModal"

import ProductInfo from '../product-info';
import BookingListPopover from '../BookingListPopover';
import AdminActionLogs from '../Log';

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




  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
const [subscriptions, setSubscriptions] = useState([]);
const [loadingSubs, setLoadingSubs] = useState(false);
const [errorSubs, setErrorSubs] = useState(null);
const [selectedSub, setSelectedSub] = useState(null);

// Add this useEffect for fetching subscriptions
useEffect(() => {
  if (isSubModalOpen) {
    const fetchSubscriptions = async () => {
      try {
        setLoadingSubs(true);
        const response = await axios.get('https://backend.sakanijo.com/api/subscriptions');
        setSubscriptions(response.data);
        setErrorSubs(null);
      } catch (err) {
        setErrorSubs(err.message);
      } finally {
        setLoadingSubs(false);
      }
    };
    fetchSubscriptions();
  }
}, [isSubModalOpen]);

// Update handelSubAds function
const handelSubAds = () => {
  setIsSubModalOpen(true);
  handleCloseMenu();
};

// Add subscription selection handler
const handleSelectSubscription = (subscription) => {
  setSelectedSub(subscription);
};

// Add subscription confirmation handler
const confirmSubscription = async () => {
  if (!selectedSub) return;
  const adminToken = localStorage.getItem("token")

  try {
    const response = await axios.post('https://backend.sakanijo.com/api/make-vip', {
      placeId: productId,
      duration: selectedSub.duration,
      adminToken
    });

    if (response.status === 200) {
      alert('تم تفعيل الاشتراك بنجاح!');
      setIsSubModalOpen(false);
      setProducts({...products , sponsored : 1 , vipExpiresAt :response.data.vipExpiresAt })

      setSelectedSub(null);
    }
  } catch (error) {
    console.log(error)
    alert('حدث خطأ أثناء التفعيل: ');
  }
};



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
      const adminToken = localStorage.getItem("token")

      try{
        const repsone = await axios.put(`https://backend.sakanijo.com/places/${+productId}/approve` , {
          adminToken
        }) 
        if (repsone.status === 200) {
          setProducts({...products , approved : !products.approved})
         alert('تم التعديل بنجاح')
        } 
    
      }
      catch(error) {
        console.log(error)
        alert("error :" , error)
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

  // Add these helper functions
const getSubscriptionColor = (title, isBackground = false) => {
  const colors = {
    'الذهبي': isBackground ? 'linear-gradient(45deg, #FFD700 0%, #DAA520 100%)' : '#DAA520',
    'البلاتيني': isBackground ? 'linear-gradient(45deg, #e5e4e2 0%, #b8b8b8 100%)' : '#808080',
    'الماسي': isBackground ? 'linear-gradient(45deg, #00ffff 0%, #005bea 100%)' : '#005bea'
  };
  return colors[title.split(' ')[1]] || '#00ab55';
};

const getSubscriptionIcon = (title) => {
  const icons = {
    'الذهبي': 'mdi:crown',
    'البلاتيني': 'mdi:shield-star',
    'الماسي': 'mdi:diamond-stone'
  };
  return icons[title.split(' ')[1]] || 'mdi:rocket';
};

const getDurationText = (duration) => {
  const durations = {
    '1week': 'أسبوع واحد',
    '15days': '15 يوم',
    '30days': 'شهر كامل'
  };
  return durations[duration] || duration;
};


const stateAdmin = localStorage.getItem("role")


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
              {/* Add these new items */}
              {products.sponsored === 1 && (
    <Grid item xs={4}>
      <ProductInfo
        name={t('ينتهي في')}
        value={moment.tz(products.vipExpiresAt, 'Asia/Amman').format('YYYY-MM-DD HH:mm')}
        valueColor="warning.main"
      />
    </Grid>
  )}
  <Grid item xs={4}>
    <ProductInfo
      name={t('الحالة المميزة')}
      value={products.sponsored === 1 ? 'مميز' : 'عادي'}
      valueColor={products.sponsored === 1 ? 'primary.main' : 'text.secondary'}
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
            <Grid item xs={4}>
              <ProductInfo name={t('اسم المعلن')} value={products.ownerName} />
            </Grid>
            <Grid item xs={4}>
              <ProductInfo name={t('رقم هاتف المعلن')} value={products.ownerPhone} />
            </Grid>
            <Grid item xs={4}>
              <ProductInfo name={t('رقم المعلن')} value={products.owner_id} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" component="span">
                {t('الوصف')}:{' '}
              </Typography>
              <Typography variant="body1" ml={1}>
                {products.description}
              </Typography>

<div style={{display:"flex" , gap:10}}>
          <a href={`tel:${products?.ownerPhone?.toString()}`}>
            <button className="button-3" type='button'>
              {products.ownerPhone}
            </button>
          </a>

          <ShareButton  shareLink={`https://sakanijo.com/place/${products?.id}`} />

</div>
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
              <MenuItem onClick={handelSubAds}>ترويج الاعلان</MenuItem>
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
                     


{stateAdmin === "admin"? 

  <AdminActionLogs placeId={productId} /> 

:
null}


                        <Dialog 
  open={isSubModalOpen} 
  onClose={() => setIsSubModalOpen(false)}
  fullWidth
  maxWidth="md"
  sx={{
    '& .MuiPaper-root': {
      borderRadius: 4,
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      overflow: 'visible',
    }
  }}
>
  {/* Floating Decorative Element */}
  <Box sx={{
    position: 'absolute',
    top: -100,
    right: -100,
    width: 200,
    height: 200,
    background: 'linear-gradient(45deg, #00c6fb 0%, #005bea 100%)',
    borderRadius: '50%',
    filter: 'blur(80px)',
    opacity: 0.2,
    zIndex: 0,
  }} />

  <DialogTitle sx={{ 
    textAlign: 'center', 
    py: 4,
    position: 'relative',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(245,247,250,0.9) 100%)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px 16px 0 0',
    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.05)',
  }}>
    <Typography variant="h3" sx={{ 
      fontWeight: 800,
      background: 'linear-gradient(45deg, #2b1055 0%, #4a2a8a 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      mb: 1
    }}>
      ترقية الإعلان
    </Typography>
    <Typography variant="body1" color="text.secondary">
      اختر الباقة المناسبة لزيادة ظهور إعلانك
    </Typography>
  </DialogTitle>
  
  <DialogContent sx={{ position: 'relative', zIndex: 1 }}>
    {loadingSubs && (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        py: 4,
        '& > *': {
          color: 'primary.main'
        }
      }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    ) 
    }
    
    { errorSubs ? (
      <Box sx={{ 
        textAlign: 'center', 
        p: 4,
        background: 'rgba(255, 58, 68, 0.1)',
        borderRadius: 2
      }}>
        <Iconify icon="ion:warning" width={40} sx={{ color: 'error.main', mb: 2 }} />
        <Typography color="error.main">
          فشل في تحميل الباقات: {errorSubs}
        </Typography>
      </Box>
    ) : (
      <Grid container spacing={3} sx={{ py: 2 }}>
        {subscriptions.map((sub) => (
          <Grid item xs={12} md={4} key={sub.id}>
            <Card 
              onClick={() => handleSelectSubscription(sub)}
              sx={{
                cursor: 'pointer',
                border: '2px solid',
                borderColor: selectedSub?.id === sub.id ? 'primary.main' : 'transparent',
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(20px)',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 15px 45px rgba(31, 38, 135, 0.2)'
                },
                position: 'relative',
                overflow: 'visible',
                ...(selectedSub?.id === sub.id && {
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(245,247,250,0.9) 100%)',
                })
              }}
            >
              {/* Subscription Badge */}
              <Box sx={{
                position: 'absolute',
                top: -15,
                right: 20,
                background: getSubscriptionColor(sub.title),
                color: '#fff',
                px: 2,
                py: 0.5,
                borderRadius: 2,
                fontSize: 12,
                fontWeight: 700,
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}>
                {sub.title.split(' ')[1]}
              </Box>

              <CardContent sx={{ 
                textAlign: 'center',
                py: 4,
                position: 'relative'
              }}>
                {/* Subscription Icon */}
                <Box sx={{
                  width: 60,
                  height: 60,
                  background: getSubscriptionColor(sub.title, true),
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3
                }}>
                  <Iconify 
                    icon={getSubscriptionIcon(sub.title)} 
                    width={32} 
                    sx={{ color: '#fff' }} 
                  />
                </Box>

                {/* Price */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h2" sx={{ 
                    fontWeight: 800,
                    color: 'primary.main',
                    lineHeight: 1
                  }}>
                    {sub.price} JOD
                  </Typography>
                  {sub.beforePrice && (
                    <Typography variant="body2" color="text.disabled" sx={{
                      textDecoration: 'line-through',
                      mt: 0.5
                    }}>
                      {sub.beforePrice} JOD
                    </Typography>
                  )}
                </Box>

                {/* Duration */}
                <Chip 
                  label={getDurationText(sub.duration)} 
                  sx={{ 
                    mb: 3,
                    background: 'rgba(0, 171, 85, 0.1)',
                    color: 'primary.main',
                    fontWeight: 700
                  }} 
                />

                {/* Description */}
                <Typography variant="body2" color="text.secondary" paragraph>
                  {sub.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    )
    }
  </DialogContent>

  <DialogActions sx={{ 
    justifyContent: 'center', 
    py: 3,
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(20px)',
    borderTop: '1px solid rgba(255, 255, 255, 0.3)'
  }}>
    <Button 
      variant="outlined" 
      onClick={() => setIsSubModalOpen(false)}
      sx={{ 
        mx: 2,
        borderRadius: 2,
        px: 4,
        borderWidth: 2,
        '&:hover': { borderWidth: 2 }
      }}
    >
      إلغاء
    </Button>
    
    <Button
      variant="contained"
      onClick={confirmSubscription}
      disabled={!selectedSub}
      sx={{ 
        mx: 2,
        borderRadius: 2,
        px: 4,
        background: 'linear-gradient(45deg, #00c6fb 0%, #005bea 100%)',
        boxShadow: '0 8px 25px rgba(0, 198, 251, 0.3)',
        '&:hover': {
          boxShadow: '0 12px 35px rgba(0, 198, 251, 0.4)'
        }
      }}
    >
      تأكيد الترقية
    </Button>
  </DialogActions>
</Dialog>


                        <BookingListPopover open={bookingInfoOpen} onClose={handleBookingClose} />
                      </Container>
                    );

                   

                  }  

