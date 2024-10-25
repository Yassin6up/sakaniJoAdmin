import { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

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
} from '@mui/material';

import { ProductPurchaseType, ProductType } from 'src/_mock/products';

import Iconify from 'src/components/iconify';
import { If } from 'src/components/statments';

const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function ProductAddPopover({ open, onClose, onSubmit }) {
  const { t } = useTranslation();
  const [purchaseType, setPurchaseType] = useState();
  const [bookingDays, setBookingDays] = useState({});
  const [priceType, setPriceType] = useState('Inchangable');
  const [inFrontStreet, setInFrontStreet] = useState(false);
  const [productType, setProductType] = useState(ProductType.Unselected);
  const [productsRooms, setProductsRooms] = useState(3);
  // const [productKitchen, setProductsKitchen] = useState(1);
  // const [productsToilets, setProductsToilets] = useState(1);

  const onPurchaseTypeChange = (ev) => setPurchaseType(ev.target.value);
  const onBookingDaysChange = (ev, checked) => {
    setBookingDays((v) => {
      v[ev.target.name] = {
        checked,
        price: -1,
      };
      console.log(v);
      return v;
    });
  };
  const onPriceTypeChange = (ev) => setPriceType(ev.target.value);

  const onInFrontStreetChange = (ev) => setInFrontStreet(ev.target.value);
  const onChoseProductType = (ev) => setProductType(ProductType[ev.target.value]);

  const onProductsRoomsChange = (ev, value) => setProductsRooms(value);
  // const onProductsKitchenChange = (ev, value) => setProductsKitchen(value);
  // const onProductsToiletsChange = (ev, value) => setProductsToilets(value);
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
          <Grid item xs={4}>
            <Typography
              variant="h4"
              bgcolor="#cbd3d6"
              color="#80888a"
              borderRadius={1}
              height="300px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {t('select_or_drag_some_pics_t')}
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Grid container spacing={2} mt={1}>
              {/* PRODUCT NAME */}
              <Grid item xs={12}>
                <TextField fullWidth required label={t('product_name_t')} />
              </Grid>

              {/* PURCHASE TYPE */}
              <Grid item xs={6}>
                <FormControl required fullWidth>
                  <InputLabel id="purchase-type">{t('purchase_type_t')}</InputLabel>
                  <Select
                    labelId="purchase-type"
                    label={t('purchase_type_t')}
                    defaultValue={ProductPurchaseType.Purchase}
                    onChange={onPurchaseTypeChange}
                  >
                    <MenuItem value={ProductPurchaseType.Rent}>{t('Rent')}</MenuItem>
                    <MenuItem value={ProductPurchaseType.Purchase}>{t('Pruchase')}</MenuItem>
                    <MenuItem value={ProductPurchaseType.Booking}>{t('Booking')}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

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
                />
              </Grid>

              {/* ADDRESS */}
              <Grid item xs={6}>
                <TextField fullWidth id="add-product-address" label={t('address_t')} required />
              </Grid>

              {/* SPACE */}
              <Grid item xs={6}>
                <TextField fullWidth id="pruduct-space" label={t('space_t')} required />
              </Grid>

              {/* IF THE ADMIN CHOSE LAND */}
              <If condition={productType === ProductType.Land}>
                {/* IN FRONT OF STREET */}
                <Grid item xs={6}>
                  <FormControl required fullWidth>
                    <InputLabel id="product-infront-of-street">
                      {t('product_infront_of_street_t')}
                    </InputLabel>
                    <Select
                      id="product-infront-of-street-select"
                      labelId="product-infront-of-street"
                      label={t('product_infront_of_street_t')}
                      onChange={onInFrontStreetChange}
                      defaultValue={false}
                    >
                      <MenuItem value>{t('yes_t')}</MenuItem>
                      <MenuItem value={false}>{t('no_t')}</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </If>
            </Grid>
          </Grid>

          {/* IF THE ADMIN CHOCES HOUSE OR APARTMENT */}
          <If
            condition={productType === ProductType.House || productType === ProductType.Apartment}
          >
            {/* PRODUCTS ROOMS COUNT */}
            <Grid item xs={4}>
              <FormControl fullWidth>
                <FormLabel>Rooms</FormLabel>
                <Slider
                  defaultValue={productsRooms}
                  valueLabelDisplay="auto"
                  min={1}
                  max={10}
                  step={1}
                  getAriaValueText={(value) => `${value} rooms`}
                  onChange={onProductsRoomsChange}
                  marks
                />
              </FormControl>
            </Grid>

            {/* PRODUCT KITCHEN COUNT */}
            <Grid item xs={4}>
              <FormControl fullWidth>
                <FormLabel>Kitchen</FormLabel>
                <Slider
                  defaultValue={productsRooms}
                  valueLabelDisplay="auto"
                  min={1}
                  max={10}
                  step={1}
                  getAriaValueText={(value) => `${value} kitchens`}
                  // onChange={onProductsKitchenChange}
                  marks
                />
              </FormControl>
            </Grid>

            {/* PRODUCTS TOILETS COUNT */}
            <Grid item xs={4}>
              <FormControl fullWidth>
                <FormLabel>Toilets</FormLabel>
                <Slider
                  defaultValue={productsRooms}
                  valueLabelDisplay="auto"
                  min={1}
                  max={10}
                  step={1}
                  getAriaValueText={(value) => `${value} toilets`}
                  // onChange={onProductsToiletsChange}
                  marks
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl>
                <FormLabel>Advantages</FormLabel>
                <FormGroup row>
                  <FormControlLabel control={<Checkbox />} label="Balcony" />
                  <FormControlLabel control={<Checkbox />} label="Furnished" />
                  <FormControlLabel control={<Checkbox />} label="Elevator" />
                  <FormControlLabel control={<Checkbox />} label="Duplex" />
                  <FormControlLabel control={<Checkbox />} label="Window Protection" />
                  <FormControlLabel control={<Checkbox />} label="Fixed Kitchen" />
                  <FormControlLabel control={<Checkbox />} label="Wall Cabinet" />
                  <FormControlLabel control={<Checkbox />} label="Decor" />
                  <FormControlLabel control={<Checkbox />} label="Double Glazed Windows" />
                </FormGroup>
              </FormControl>
            </Grid>
          </If>

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
              />
            </Grid>
          </If>

          {/* HOW MUCH STREET IS INFRONT OF IT */}
          <If condition={inFrontStreet} Component={Grid} item xs={3}>
            <TextField
              fullWidth
              required
              id="infront-street-count"
              type="number"
              lable={t('street_count_t')}
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
                    <FormLabel id="showing-the-price">Are you?</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="showing-the-price-lable"
                      defaultValue="owner"
                      name="radio-buttons-group"
                    >
                      <FormControlLabel value="mediator" control={<Radio />} label="Mediator" />
                      <FormControlLabel
                        value="owner"
                        control={<Radio />}
                        label="The owner of real estate"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </If>

              {/* FOR BOOKING PURCHASE */}
              <If condition={purchaseType === ProductPurchaseType.Booking}>
                <Grid item xs={4}>
                  <FormControl>
                    <FormLabel id="showing-the-price">Booking Type</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="showing-the-price-lable"
                      defaultValue={24}
                      name="radio-buttons-group"
                    >
                      <FormControlLabel value={24} control={<Radio />} label="24 hours" />
                      <FormControlLabel value={12} control={<Radio />} label="12 hours" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <FormControl>
                    <FormLabel id="booking-days-price">Free booking days</FormLabel>
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
                    <FormLabel id="price-type">Price type</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="price-type-lable"
                      onChange={onPriceTypeChange}
                      defaultValue={priceType}
                    >
                      <FormControlLabel value="changable" control={<Radio />} label="Changable" />
                      <FormControlLabel
                        value="Inchangable"
                        control={<Radio />}
                        label="Inchangable"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <If condition={priceType === 'changable'} Component={Grid} xs={12} item mt={1.5}>
                  <FormGroup
                    row
                    sx={{
                      gap: 1,
                    }}
                  >
                    {Object.keys(bookingDays)
                      .filter((v) => bookingDays[v].checked)
                      .map((v, key) => (
                        <TextField key={key} label={v} type="number" />
                      ))}
                  </FormGroup>
                </If>
              </If>

              {/* FOR RENT */}
              <If
                condition={purchaseType === ProductPurchaseType.Rent}
                Component={Grid}
                item
                xs={6}
              >
                <FormControl>
                  <FormLabel id="rent-type">Booking Type</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="showing-the-price-lable"
                    defaultValue="yearly"
                    name="radio-buttons-group"
                  >
                    <FormControlLabel value="yearly" control={<Radio />} label="Yearly" />
                    <FormControlLabel value="dayly" control={<Radio />} label="Monthly" />
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
                  <FormLabel id="showing-the-price">Show The price?</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="showing-the-price-lable"
                    defaultValue={false}
                    name="radio-buttons-group"
                  >
                    <FormControlLabel value control={<Radio />} label="Yes" />
                    <FormControlLabel value={false} control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth multiline label={t('description_t')} rows={10} />
          </Grid>
        </Grid>
      </Box>
    </Popover>
  );
}

ProductAddPopover.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
};
