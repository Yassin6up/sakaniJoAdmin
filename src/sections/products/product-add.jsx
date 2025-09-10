import { useState , useEffect} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Calendar from 'react-calendar';

import 'react-calendar/dist/Calendar.css';

import axios from "axios"

import {
  Popover,
  Box,
  Grid,
  Typography,
  Stack,
  IconButton,
  TextField,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Slider,
  FormGroup,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Checkbox,
  Button ,
  FormHelperText
} from '@mui/material';

import { ProductPurchaseType, ProductType, features } from 'src/_mock/products';

import Iconify from 'src/components/iconify';
import { If } from 'src/components/statments';

import { jordanCities as JordanCities } from './jordanCities';

const weekDays = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

export default function ProductAddPopover({ open, onClose, onSubmit }) {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [address, setAddress] = useState('');
  const [purchaseType, setPurchaseType] = useState("للبيع");
  const [bookingDays, setBookingDays] = useState({});
  const [priceType, setPriceType] = useState('تابت');
  const [inFrontStreet, setInFrontStreet] = useState(false);
  const [productType, setProductType] = useState(ProductType.Unselected);
  const [productsRooms, setProductsRooms] = useState(3);
  const [tripStartDate, setTripStartDate] = useState(new Date());
  const [poolType, setPoolType] = useState("");
  const [deepPool, setDeepPool] = useState("");
  const [longTrip, setLongTrip] = useState("");
  const [space, setSpace] = useState("");
  const [homesInBuilding, setHomesInBuild] = useState("");
  const [streetCount, setStreetsCount] = useState("");

  const [showPrice, setShowPrice] = useState("");
  const [ownerState, seTOwnerState] = useState("مالك");
  const [bookingType, setBookingType] = useState("24ساعة");
  const [productKitchen, setProductsKitchen] = useState(1);
  const [productsToilets, setProductsToilets] = useState(1);
  const [images, setImages] = useState([]);
  const [phone, setPhone] = useState("");
  const [acceptedMessages, setAcceptedMessages] = useState("whatsapp");

  
  const [selectedUser, setSelectedUser] = useState({});
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState([]);

  const [city, setCity] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [street, setStreet] = useState("");
  const [closePlace, setClosePlace] = useState("");

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);





  // Helper function to get neighborhoods based on the selected city
  const getCurrentNeighborhoods = () => {
    if (city && JordanCities[city]) {
      return JordanCities[city].places.map((place) => place.name);
    }
    return [];
  };

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setCity(t(selectedCity));
    setNeighborhood(""); // Reset neighborhood when city changes
    setLatitude(JordanCities[selectedCity]?.coordinate.lat || null);
    setLongitude(JordanCities[selectedCity]?.coordinate.long || null);
  };

  const handleNeighborhoodChange = (e) => {
    const selectedNeighborhood = e.target.value;
    setNeighborhood(t(selectedNeighborhood));

    // Update latitude and longitude based on the selected neighborhood
    if (city && JordanCities[city]) {
      const selectedPlace = JordanCities[city].places.find(
        (place) => place.name === selectedNeighborhood
      );
      if (selectedPlace) {
        setLatitude(selectedPlace.lat);
        setLongitude(selectedPlace.long);
      }
    }
  };

  const handleStreetChange = (e) => {
    setStreet(e.target.value);
  };
  const handleClosePlace = (e) => {
    setClosePlace(e.target.value);
  };



  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://backend.sakanijo.com/admin/users');
        const data = await response.json();
        console.log(data)
        setUsers(data);
      } catch (error) {
        console.error('خطأ في جلب المستخدمين:', error);
      }
    };
    fetchUsers();
  }, []);



  const onPurchaseTypeChange = (ev) => setPurchaseType(ev.target.value);

  const onBookingDaysChange = (ev, checked) => {
    setBookingDays((v) => {
      v[ev.target.name] = price;
      console.log(v);
      return v;
    });
  };


  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImages((prev) => [...prev, { file, url: imageUrl }]);
    }
  };

  const handleAddImageClick = () => {
    document.getElementById('image-upload-input').click();
  };
  const onPriceTypeChange = (ev) => setPriceType(ev.target.value);

  const onInFrontStreetChange = (ev) => setInFrontStreet(ev.target.value);
  const onChoseProductType = (ev) => setProductType(ProductType[ev.target.value]);

  const onProductsRoomsChange = (ev, value) => setProductsRooms(value);
  const onProductsKitchenChange = (ev, value) => setProductsKitchen(value);
  const onProductsToiletsChange = (ev, value) => setProductsToilets(value);

  const [selectedFeatures, setSelectedFeatures] = useState([]);

  // Handler to update the selected features state
  const handleFeatureChange = (event, feature) => {
    setSelectedFeatures((prevSelected) => {
      if (event.target.checked) {
        // If the checkbox is checked, add the feature to the selected features list
        return [...prevSelected, feature];
      }
      // If the checkbox is unchecked, remove the feature from the selected features list
      return prevSelected.filter((item) => item !== feature);
    });
  };
  

  useEffect(()=>{
    if(productType !== ProductType.TripOrganization  &&  productType !== ProductType.Playground   &&  productType !== ProductType.Swimming_Pool 
      &&  productType !== ProductType.CampsAndCabins 
      &&  productType !== ProductType.Gym ){
        console.log("not booking")
      }else{
         setPurchaseType('الحجز')
      }
  },[productType])



  const handelSubmit = async () => {


    if(title === "" || city === "" || neighborhood === ""   || price === "" || images.length === 0){
      alert("بعض البينات غير مكتملة")
      return ;
    }
    
    setLoading(true)
    const dataObject = {
      title: title || null,
      address: `${city} - ${neighborhood}` || null,
      street: street || null,
      closePlace : closePlace || null ,
      description: description || null,
      perks: null,
      extraInfo: null,
      maxGuests: null,
      price: price || null,
      ownerId: selectedUser.id,
      type: productType || null,
      sellingMethod: null,
      ownerPhone: selectedUser.phone,
      homeType: productType,
      farmHasHouse: null,
      farmHasWater: null,
      farmHasFarmed: null,
      landInFaceOfStreet: inFrontStreet || null,
      numberOfStreetsInLand: streetCount || null,
      spaceGeneral: space || null,
      numberOfHomeStage: homesInBuilding || null,
      totalStages: null,
      numberOfRooms: JSON.stringify({kitchen: productKitchen ,rooms: productsRooms,bathroom:productsToilets,stages: homesInBuilding}) || null,
      buyOrRent: purchaseType || null,
      rentType: null,
      ownerStatus: ownerState || null,
      location: address || null,
      amenities: JSON.stringify(selectedFeatures),
      hajezDays: JSON.stringify(weekDays),
      hajezType: bookingType || null,
      variablePrices: JSON.stringify(bookingDays) ,
      publisherState: null,
      adsAccept: null,
      priceHide: showPrice || null,
      specificDaysInCalander: null,
      specificDaysCalanderPrice: null,
      latitude,
      longitude,
      ownerName: selectedUser.name,
      poolType: poolType || null,
      deepPool: deepPool || null,
      gettingCalls: acceptedMessages,
      containSdah: null,
      evacuation: null,
      tripLong: longTrip || null,
      tripDate: tripStartDate || null,
      timeOpen: null,
      meetingRoomType: null,
      countPeople: null,
      subscriptionTypeGym: null,
      priceBeforeNoon: null,
      priceAfterNoon: null,
    };
  
    const formData = new FormData();
  
    // Use Object.entries to iterate through the object
    Object.entries(dataObject).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });
  
    // Append images to formData
    for (let i = 0; i < images.length; i+= 1) {
      const image = images[i];
      console.log(image);
      formData.append("images", image.file);
    }
  
    try {
      const response = await axios.post(
        "https://backend.sakanijo.com/api/places/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("تم نشر بنجاح")
      onClose()
      setLoading(false)

    } catch (error) {
      setLoading(false)
      console.error("Error submitting data:", error.response?.data || error.message);
    }
  };
  
  

  return (
    <Popover
      id="add-product-popover"
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'center',
        horizontal: 'center',
      }}
      PaperProps={{
        sx: {
          width: '70%',
        },
      }}
    >
      <Box sx={{ padding: 1 }}>
        <Stack direction="row" padding={2} alignItems="center" justifyContent="space-between">
          <Typography variant="h4">{t('create_product_t')}</Typography>

          <IconButton onClick={onClose}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Stack>
        <Grid container spacing={2} padding={1} sx={{ px: 2.5, mb: 2 }}>
          <Grid item xs={12}>
            <Typography variant="h6">{t('الصور')}</Typography>
            <Grid container spacing={2}>
              {images.map((image, index) => (
                <Grid key={index} item xs={3}>
                  <Box
                    sx={{
                      width: '100%',
                      height: 150,
                      backgroundImage: `url(${image.url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: 1,
                      border: '1px solid #ddd',
                    }}
                  />
                </Grid>
              ))}
              <Grid item xs={3}>
                <Box
                  sx={{
                    width: '100%',
                    height: 150,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1,
                    border: '1px dashed #ddd',
                    cursor: 'pointer',
                    color: '#80888a',
                  }}
                  onClick={handleAddImageClick}
                >
                  <Typography>{t('اضافة صورة')}</Typography>
                </Box>
              </Grid>
            </Grid>
            <input
              type="file"
              id="image-upload-input"
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleImageUpload}
            />
          </Grid>
          <Grid item xs={8}>

                  <FormControl required fullWidth>
                    <InputLabel id="product-infront-of-street">
                    اختر المستخدم
                    </InputLabel>
                    <Select
                      id="product-infront-of-street-select"
                      labelId="product-infront-of-street"
                      label=" اختر المستخدم"
                      onChange={(e)=>{
                        setSelectedUser(e.target.value)
                      }}
                    >
                    {
                      users.map((user)=><MenuItem value={user}>{user.id}, {user.name}</MenuItem>)
                    }
                    </Select>
                  </FormControl>

            <Grid container spacing={2} mt={1}>
              {/* PRODUCT NAME */}
              <Grid item xs={12}>
                <TextField fullWidth required label={t('product_name_t')}  onChange={(e)=>{setTitle(e.target.value)}}/>
              </Grid>

              {/* PURCHASE TYPE */}

              <If condition={productType !== ProductType.TripOrganization  &&  productType !== ProductType.Playground   && productType !== ProductType.Swimming_Pool 
               &&  productType !== ProductType.CampsAndCabins 
               &&  productType !== ProductType.Gym }>
              <Grid item xs={6}>
                <FormControl required fullWidth>
                  <InputLabel id="purchase-type">{t('purchase_type_t')}</InputLabel>
                  <Select
                    labelId="purchase-type"
                    label={t('purchase_type_t')}
                    defaultValue={ProductPurchaseType.Purchase}
                    onChange={onPurchaseTypeChange}
                  >
                    <MenuItem value={ProductPurchaseType.Rent}>{t('ايجار')}</MenuItem>
                    <MenuItem value={ProductPurchaseType.Purchase}>{t('Pruchase')}</MenuItem>
                    <MenuItem value={ProductPurchaseType.Booking}>{t('الحجز')}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>


              </If>



              
              {/* PRODUCT TYPE */}
              <Grid item xs={6}>
                <FormControl required fullWidth>
                  <InputLabel id="product-type">{t('product_type_t')}</InputLabel>
                  <Select
                    onChange={onChoseProductType}
                    labelId="product-type"
                    label={t('product_type_t')}
                    defaultValue={ProductType.Unselected}
                  >
                    {Object.keys(ProductType).map(
                      (v, key) =>
                        v !== ProductType.Unselected && (
                          <MenuItem key={key} value={v}>
                            {t(ProductType[v])}
                          </MenuItem>
                        )
                    )}
                  </Select>
                </FormControl>
              </Grid>

              {/* PRODUCT PRICE */}
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  required
                  id="add-product-price"
                  type="number"
                  label={t('sale_price_t')}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(e)=>{setPrice(e.target.value)}}
                />
              </Grid>


        <Grid item xs={12}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="city-label">المدينة</InputLabel>
            <Select
              labelId="city-label"
              id="city"
              value={city}
              onChange={handleCityChange}
              label="المدينة"
            >
              <MenuItem value="">إختار المدينة</MenuItem>
              {Object.keys(JordanCities).map((cityName) => (
                <MenuItem key={cityName} value={cityName}>
                  {t(cityName)}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>إختار المدينة المناسبة</FormHelperText>
          </FormControl>
        </Grid>

              <Grid item xs={12}>
          <FormControl fullWidth margin="normal" disabled={!city}>
            <InputLabel id="neighborhood-label">المنطقة</InputLabel>
            <Select
              labelId="neighborhood-label"
              id="neighborhood"
              value={neighborhood}
              onChange={handleNeighborhoodChange}
              label="المنطقة"
              disabled={!city}
            >
              <MenuItem value="">إختار المنطقة</MenuItem>
              {getCurrentNeighborhoods().map((neighborhoodName) => (
                <MenuItem key={neighborhoodName} value={neighborhoodName}>
                  {t(neighborhoodName)}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>إختار المنطقة المناسبة</FormHelperText>
          </FormControl>
        </Grid>

              <Grid item xs={12}>
          <TextField
            fullWidth
            margin="normal"
            label="الشارع"
            value={street}
            onChange={handleStreetChange}
            placeholder="ادخل الشارع"
            helperText="أدخل اسم الشارع"
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            margin="normal"
            label="المنطقة المحيطية"
            value={closePlace}
            onChange={handleClosePlace}
            placeholder="المنطقة المحيطية"
            helperText="المنطقة المحيطية"
          />
        </Grid>




              {/* SPACE */}
              <Grid item xs={6}>
                <TextField fullWidth id="pruduct-space" label="مساحة" required onChange={(e)=>{
                  setSpace(e.target.value)
                }} />
              </Grid>

              {/* IF THE ADMIN CHOSE LAND */}
              <If condition={productType === ProductType.Land}>
                {/* IN FRONT OF STREET */}
                <Grid item xs={6}>
                  <FormControl required fullWidth>
                    <InputLabel id="product-infront-of-street">
                      هل تقع الارض امام شارع
                    </InputLabel>
                    <Select
                      id="product-infront-of-street-select"
                      labelId="product-infront-of-street"
                      label={t('product_infront_of_street_t')}
                      onChange={onInFrontStreetChange}
                      defaultValue='لا'
                    >
                      <MenuItem value='نعم'>{t('نعم')}</MenuItem>
                      <MenuItem value='لا'>{t('لا')}</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </If>
            </Grid>
          </Grid>

 
          <If condition={ productType === ProductType.Swimming_Pool  ||  productType === ProductType.Gym }>

          <Grid item xs={6}>
                  <FormControl required fullWidth>
                    <InputLabel id="product-infront-of-street">
                      خاص ب 
                    </InputLabel>
                    <Select
                      id="product-infront-of-street-select"
                      labelId="product-infront-of-street"
                      
                      onChange={(e)=>{setPoolType(e.target.value)}}
                      defaultValue="رجالي" 
                      >
                      <MenuItem value="نسائي">نسائي</MenuItem>
                      <MenuItem value="رجالي">رجالي</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
               </If>

               <If condition={ productType === ProductType.Swimming_Pool }>

          <Grid item xs={6}>
                  <FormControl required fullWidth>
                    <InputLabel id="product-infront-of-street">
                       عمق المسبح
                    </InputLabel>
                    <Select
                      id="product-infront-of-street-select"
                      labelId="product-infront-of-street"
                      onChange={(e)=>{setDeepPool(e.target.value)}}
                      defaultValue="1متر" 
                      >
                      <MenuItem value="1متر">1متر</MenuItem>
                      <MenuItem value="2متر">2متر</MenuItem>
                      <MenuItem value="4متر">4متر</MenuItem>
                      <MenuItem value="5+متر">5+متر</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
               </If>

          {/* IF THE ADMIN CHOCES HOUSE OR APARTMENT */}
          <If
            condition={productType === ProductType.House || productType === ProductType.Apartment}
          >
            {/* PRODUCTS ROOMS COUNT */}
            <Grid item xs={4}>
              <FormControl fullWidth>
                <FormLabel>غرفة</FormLabel>
                <Slider
                  defaultValue={productsRooms}
                  valueLabelDisplay="auto"
                  min={1}
                  max={10}
                  step={1}
                  getAriaValueText={(value) => `${value}`}
                  onChange={onProductsRoomsChange}
                  marks
                />
              </FormControl>
            </Grid>

            {/* PRODUCT KITCHEN COUNT */}
            <Grid item xs={4}>
              <FormControl fullWidth>
                <FormLabel>مطبخ</FormLabel>
                <Slider
                  defaultValue={2}
                  valueLabelDisplay="auto"
                  min={1}
                  max={10}
                  step={1}
                  getAriaValueText={(value) => `${value}`}
                  onChange={onProductsKitchenChange}
                  marks
                />
              </FormControl>
            </Grid>

            {/* PRODUCTS TOILETS COUNT */}
            <Grid item xs={4}>
              <FormControl fullWidth>
                <FormLabel>حمام</FormLabel>
                <Slider
                  defaultValue={1}
                  valueLabelDisplay="auto"
                  min={1}
                  max={10}
                  step={1}
                  getAriaValueText={(value) => `${value}`}
                  onChange={onProductsToiletsChange}
                  marks
                />
              </FormControl>
            </Grid>
          </If>

          <Grid container spacing={2}>
      {Object.entries(features).map(([featureKey, featureList]) => {
        // Map the featureKey to its corresponding ProductType
        const productTypeKey = Object.keys(ProductType).find((key) =>
          featureKey.toLowerCase().includes(key.toLowerCase())
        );

        const productTypeLabel = ProductType[productTypeKey];

        return productTypeKey ? (
          <If condition={productType === ProductType[productTypeKey]} key={productTypeKey}>
            <Grid item xs={12}>
              <FormControl>
                <FormLabel>المزايا لـ {productTypeLabel}</FormLabel>
                <FormGroup row>
                  {featureList.map((feature, index) => (
                    <FormControlLabel
                      key={index}
                      control={
                        <Checkbox
                          onChange={(event) => handleFeatureChange(event, feature)} // Update state on change
                          checked={selectedFeatures.includes(feature)} // Check if feature is selected
                        />
                      }
                      label={feature}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </Grid>
          </If>
        ) : null;
      })}
    </Grid>

          <If condition={productType === ProductType.Apartment}>
            <Grid item xs={4}>
              <TextField fullWidth required defaultValue={1} id="floor" label={t('floor_t')} />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                required
                defaultValue={1}
                id="apartments-in-building"
                label={t('apartments_in_building_t')}
                onChange={(e)=>{
                  setHomesInBuild(e.target.value)
                }}
              />
            </Grid>
          </If>

          {/* HOW MUCH STREET IS INFRONT OF IT */}
          <If condition={inFrontStreet === "نعم"} Component={Grid} item xs={3}>
          <InputLabel id="infront-street-count">{t('عدد الشوارع جنبها')}</InputLabel>

            <TextField
              fullWidth
              required
              id="infront-street-count"
              type="number"
              onChange={(e)=>{
                setStreetsCount(e.target.value)
              }}
              lable={t('عدد الشوارع جنبها')}
              InputLabelProps={{
                shrink: true,
              }}
            />

          </If>

          <Grid item xs={12}>
            <Grid container>
              {/* THE WHO ARE YOU */}
              <If condition={purchaseType === ProductPurchaseType.Purchase}>
                <Grid item xs={6}>
                  <FormControl>
                    <FormLabel id="showing-the-price">هل أنت ؟</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="showing-the-price-lable"
                      defaultValue="مالك"
                      name="radio-buttons-group"
                      onChange={(e)=>{
                        seTOwnerState(e.target.value)
                      }} // Update state on change

                    >
                      <FormControlLabel value="الوسيط" control={<Radio />} label="الوسيط" />
                      <FormControlLabel
                        value="مالك"
                        control={<Radio />}
                        label="مالك"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </If>

              {/* FOR BOOKING PURCHASE */}
              <If condition={purchaseType === ProductPurchaseType.Booking}>
                <Grid item xs={4}>
                  <FormControl>
                    <FormLabel id="showing-the-price">نوع الحجز</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="showing-the-price-lable"
                      defaultValue="24ساعة"
                      name="radio-buttons-group"
                      onChange={(e)=>{setBookingType(e.target.value)}}
                    >
                      <FormControlLabel value="24ساعة" control={<Radio />} label="24ساعة" />
                      <FormControlLabel value="12h" control={<Radio />} label="12h" />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={4}>
                  <FormControl>
                    <FormLabel id="booking-days-price">الأيام المتاحة للحجز</FormLabel>
                    <FormGroup row>
                      {weekDays.map((v, key) => (
                        <FormControlLabel
                          key={key}
                          value={v}
                          control={<Checkbox onChange={onBookingDaysChange} name={v} />}
                          label={v}
                        />
                      ))}
                    </FormGroup>
                  </FormControl>
                </Grid>
                <Grid item sx={4}>
                  <FormControl>
                    <FormLabel id="price-type">نوع السعر </FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="price-type-lable"
                      onChange={onPriceTypeChange}
                      defaultValue={priceType}
                    >
                      <FormControlLabel value="متغير" control={<Radio />} label="متغير" />
                      <FormControlLabel
                        value="تابت "
                        control={<Radio />}
                        label="تابت "
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <If condition={priceType === 'متغير'} Component={Grid} xs={12} item mt={1.5}>
                  <FormGroup
                    row
                    sx={{
                      gap: 1,
                    }}
                  >
                    {Object.keys(bookingDays).map((v, key) => (
                          <TextField
                            key={key}
                            label={v}
                            defaultValue={bookingDays[v]}
                            onChange={(e) => {
                              setBookingDays((prev) => ({
                                ...prev,
                                [v]: e.target.value, // Update the specific key in the state
                              }));
                            }}
                            type="number"
                          />
                        ))}

                  </FormGroup>
                </If>
              </If>

              <If condition={productType === ProductType.TripOrganization}>
              <div style={{ textAlign: 'right', margin: '20px' }}>
            <h2 style={{ fontSize: '18px', marginBottom: '10px', display: 'block' }}>
                اختر تاريخ بدء الرحلة:
            </h2>
            <Calendar
                onChange={setTripStartDate} // Updates the state with the selected date
                value={tripStartDate} // Binds the selected date
                locale="ar-EG" // Arabic locale for weekdays/months
            />
            <p style={{ marginTop: '10px', fontSize: '16px' }}>
                التاريخ المحدد: {tripStartDate.toLocaleDateString('ar-EG')}
            </p>
        </div>

        <Grid item xs={12}>
                <TextField fullWidth required label="مدة الرحلة" onChange={(e)=>{
setLongTrip(e.target.value)
                }}/>
              </Grid>
         
              </If>

              {/* FOR RENT */}
              <If
                condition={purchaseType === ProductPurchaseType.Rent}
                Component={Grid}
                item
                xs={6}
              >
                <FormControl>
                  <FormLabel id="rent-type">نوع الحجز</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="showing-the-price-lable"
                    defaultValue="سنوي"
                    name="radio-buttons-group"
                  >
                    <FormControlLabel value="سنوي" control={<Radio />} label="سنوي" />
                    <FormControlLabel value="شهري" control={<Radio />} label="شهري" />
                  </RadioGroup>
                </FormControl>
              </If>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container>
              {/* PRICE VISIBILITY */}
              <Grid item xs={6}>
                <FormControl>
                  <FormLabel id="showing-the-price">إظهار السعر؟</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="showing-the-price-lable"
                    defaultValue="true"
                    name="radio-buttons-group"
                    onChange={(e)=>{
                      setShowPrice(e.target.value)
                    }}
                  >
                    <FormControlLabel value="true" control={<Radio />} label="نعم" />
                    <FormControlLabel value={false} control={<Radio />} label="لا" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                  <FormControl required fullWidth>
                    <InputLabel id="product-infront-of-street">
                      اود تلقي الرسايل عبر :
                    </InputLabel>
                    <Select
                      id="product-infront-of-street-select"
                      labelId="product-infront-of-street"
                      label="اود تلقي الرسايل عبر :"
                      onChange={(e)=>{
                          setAcceptedMessages(e.target.value)
                      }}
                      defaultValue="whatsapp"
                    >
                      <MenuItem value="sms">sms</MenuItem>
                      <MenuItem value="whatsapp">واتساب</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth multiline onChange={(e)=>{
              setDescription(e.target.value)
            }} label={t('description_t')} rows={10} />
          </Grid>
        </Grid>
        <Button onClick={handelSubmit} disabled={loading}> {loading ? "جاري التحميل ..."  : "نشر" }  </Button>
      </Box>
    </Popover>
  );
}

ProductAddPopover.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
};
