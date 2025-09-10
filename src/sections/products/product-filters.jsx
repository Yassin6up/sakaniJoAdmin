import PropTypes from 'prop-types';
import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

// ----------------------------------------------------------------------

const GENDER_OPTIONS = ['للبيع', 'الحجز', 'ايجار'];
const CATEGORY_OPTIONS = ['شقة', 'مزرعة', 'ارض', 'مسابح', "صالات رياضة" ,"مخيمات و اكواخ" , "تنضيم رحلات", "قاعات اجتماعات", 'مكاتب وعيادات', "فيلا / منزل" , "شليهات" , "ملاعب" , "استوديو" , "محلات ومخازن" , "مكاتب وعيادات"];
const PRICE_OPTIONS = [
  { value: 'اقل_25', label: 'اقل $25' },
  { value: 'اقل_75', label: 'اقل $25 - $75' },
  { value: 'اكثر_75', label: 'اكثر $75' },
];

const STATUS_OPTIONS = [
  { value: 1, label: 'نشط' },
  { value: 0, label: 'غير نشط' },
  ];
// ----------------------------------------------------------------------

export default function ProductFilters({ openFilter, onOpenFilter, onCloseFilter , filterData , closeFilter }) {
  const [address, setAddress] = useState('');
  const [selectedGender, setSelectedGender] = useState(''); // Single selection for gender
  const [selectedCategory, setSelectedCategory] = useState(''); // Single selection for category
  const [selectedPrice, setSelectedPrice] = useState(''); // Single selection for price
  const [selecteState, setSelectedState] = useState(''); // Single selection for category

  // Handle the gender selection (as radio now)
  const handleGenderChange = (event) => {
    setSelectedGender(event.target.value);
  };

  // Filter function to send data to the backend


  // Input field for address
  const renderAddressInput = (
    <TextField
      variant="outlined"
      placeholder="إدخال العنوان"
      fullWidth
      sx={{ mb: 2 }}
      value={address}
      onChange={(e) => setAddress(e.target.value)}
      inputProps={{ style: { color: 'gray' } }}
    />
  );

  // Radio buttons for gender selection
  const renderGender = (
    <Stack spacing={1}>
      <Typography variant="subtitle2" sx={{ fontSize: '1.2rem' }}>نوع الاعلان</Typography>
      <RadioGroup value={selectedGender} onChange={handleGenderChange}>
        {GENDER_OPTIONS.map((item) => (
          <FormControlLabel key={item} value={item} control={<Radio />} label={item} />
        ))}
      </RadioGroup>
    </Stack>
  );

  // Radio buttons for category selection
  const renderCategory = (
    <Stack spacing={1}>
      <Typography variant="subtitle2" sx={{ fontSize: '1.2rem' }}>نوع العقار</Typography>
      <RadioGroup value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
        {CATEGORY_OPTIONS.map((item) => (
          <FormControlLabel key={item} value={item} control={<Radio />} label={item} />
        ))}
      </RadioGroup>
    </Stack>
  );

  const renderStatusOfAds = (
    <Stack spacing={1}>
      <Typography variant="subtitle2" sx={{ fontSize: '1.2rem' }}>حالة الإعلان</Typography>
      <RadioGroup value={selecteState} onChange={(e) => setSelectedState(e.target.value)}>
        {STATUS_OPTIONS.map((item) => (
          <FormControlLabel key={item.label} value={item.value} control={<Radio />} label={item.label} />
        ))}
      </RadioGroup>
    </Stack>
  );

  // Radio buttons for price selection
  const renderPrice = (
    <Stack spacing={1}>
      <Typography variant="subtitle2" sx={{ fontSize: '1.2rem' }}>السعر</Typography>
      <RadioGroup value={selectedPrice} onChange={(e) => setSelectedPrice(e.target.value)}>
        {PRICE_OPTIONS.map((item) => (
          <FormControlLabel
            key={item.value}
            value={item.value}
            control={<Radio />}
            label={item.label}
          />
        ))}
      </RadioGroup>
    </Stack>
  );

  return (
    <>
      <Button
        disableRipple
        style={{backgroundColor :"white"}}
        color="inherit"
        endIcon={<Iconify icon="ic:round-filter-list" />}
        onClick={onOpenFilter}
      >
        Filters&nbsp;
      </Button>

      <Drawer
        anchor="right"
        open={openFilter}
        onClose={onCloseFilter}
        PaperProps={{
          sx: { width: 280, border: 'none', overflow: 'hidden' },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 1, py: 2 }}
        >
          <Typography variant="h6" sx={{ fontSize: '1.3rem' }}>
            فلتر
          </Typography>
          <IconButton onClick={onCloseFilter}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Stack>

        <Divider />

        <Scrollbar>
          <Stack spacing={3} sx={{ p: 3 }}>
            {renderAddressInput}
            {renderStatusOfAds}
            {renderGender}
            {renderCategory}
            {/* {renderPrice} */}

          </Stack>
        </Scrollbar>

        <Box sx={{ p: 3 }}>
          <Button
            fullWidth
            size="large"
            type="submit"
            color="inherit"
            variant="outlined"
            onClick={()=>filterData(address , selectedGender ,  selectedCategory , selecteState)}
            sx={{ fontSize: '1.3rem', backgroundColor: "black", color: "white" }}
          >
            تطبيق الفلتر
          </Button>
          <Button
            fullWidth
            size="large"
            type="submit"
            color="inherit"
            variant="outlined"
            sx={{ fontSize: '1.3rem' }}
            onClick={()=>closeFilter()}
            startIcon={<Iconify icon="ic:round-clear-all" />}
          >
            حذف الكل
          </Button>
        </Box>
      </Drawer>
    </>
  );
}

ProductFilters.propTypes = {
  openFilter: PropTypes.bool,
  onOpenFilter: PropTypes.func,
  onCloseFilter: PropTypes.func,
  filterData : PropTypes.func,
  closeFilter : PropTypes.func,
};
