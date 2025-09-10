import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  Grid,
  Divider,
  Typography,
  useTheme,
} from '@mui/material';
import Iconify from 'src/components/iconify';

export default function FilterModal({ open, onClose, onApplyFilters }) {
  const theme = useTheme();
  const [filters, setFilters] = useState({
    verified: false,
    blocked: false,
    phoneVerified: false,
    newest: false,
    oldest: false,
    placesCount: false,
    sponsoredPlaces: false,
    bookingsCount: false,
  });

  const handleChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.checked,
    });
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      verified: false,
      blocked: false,
      phoneVerified: false,
      newest: false,
      oldest: false,
      placesCount: false,
      sponsoredPlaces: false,
      bookingsCount: false,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: theme.customShadows.z24,
          minWidth: 400,
          direction: 'rtl', // RTL direction
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: theme.palette.primary.lighter,
          color: theme.palette.primary.dark,
          py: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Iconify icon="ic:round-filter-list" width={24} />
          <Typography variant="h6">الفلاتر المتقدمة</Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 1, color: 'text.secondary' }}>
              حالة المستخدم
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.verified}
                      onChange={handleChange}
                      name="verified"
                      icon={<Iconify icon="mdi:account-outline" />}
                      checkedIcon={<Iconify icon="mdi:account-check" color={theme.palette.success.main} />}
                    />
                  }
                  label="مُتحقق منه"
                  sx={{ '& .MuiFormControlLabel-label': { color: 'text.primary' } }}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.blocked}
                      onChange={handleChange}
                      name="blocked"
                      icon={<Iconify icon="mdi:account-cancel-outline" />}
                      checkedIcon={<Iconify icon="mdi:account-cancel" color={theme.palette.error.main} />}
                    />
                  }
                  label="محظور"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.phoneVerified}
                      onChange={handleChange}
                      name="phoneVerified"
                      icon={<Iconify icon="mdi:cellphone-off" />}
                      checkedIcon={<Iconify icon="mdi:cellphone-check" color={theme.palette.info.main} />}
                    />
                  }
                  label="الهاتف مُتحقق منه"
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 1, color: 'text.secondary' }}>
              الترتيب حسب
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.newest}
                      onChange={handleChange}
                      name="newest"
                      icon={<Iconify icon="mdi:sort-clock-ascending" />}
                      checkedIcon={<Iconify icon="mdi:sort-clock-ascending" color={theme.palette.warning.main} />}
                    />
                  }
                  label="الأحدث أولاً"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.oldest}
                      onChange={handleChange}
                      name="oldest"
                      icon={<Iconify icon="mdi:sort-clock-descending" />}
                      checkedIcon={<Iconify icon="mdi:sort-clock-descending" color={theme.palette.warning.main} />}
                    />
                  }
                  label="الأقدم أولاً"
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 1, color: 'text.secondary' }}>
              عدد الإعلانات والحجوزات
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.placesCount}
                      onChange={handleChange}
                      name="placesCount"
                      icon={<Iconify icon="mdi:home-outline" />}
                      checkedIcon={<Iconify icon="mdi:home" color={theme.palette.primary.main} />}
                    />
                  }
                  label="عدد الإعلانات"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.sponsoredPlaces}
                      onChange={handleChange}
                      name="sponsoredPlaces"
                      icon={<Iconify icon="mdi:star-outline" />}
                      checkedIcon={<Iconify icon="mdi:star" color={theme.palette.warning.main} />}
                    />
                  }
                  label="عدد الإعلانات المميزة"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.bookingsCount}
                      onChange={handleChange}
                      name="bookingsCount"
                      icon={<Iconify icon="mdi:calendar-outline" />}
                      checkedIcon={<Iconify icon="mdi:calendar-check" color={theme.palette.success.main} />}
                    />
                  }
                  label="عدد الحجوزات"
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Button
          onClick={handleReset}
          startIcon={<Iconify icon="mdi:refresh" />}
          sx={{ color: 'text.secondary' }}
        >
          إعادة تعيين
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button onClick={onClose} variant="outlined" color="inherit" sx={{ mr: 1 }}>
          إلغاء
        </Button>
        <Button onClick={handleApply} variant="contained" startIcon={<Iconify icon="mdi:check-all" />}>
          تطبيق الفلاتر
        </Button>
      </DialogActions>
    </Dialog>
  );
}

FilterModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onApplyFilters: PropTypes.func.isRequired,
};