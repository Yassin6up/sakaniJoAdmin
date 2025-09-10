import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Switch,
  Box,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';

export default function SettingPage() {
  const [whatsappLink, setWhatsappLink] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [commissionValue, setCommissionValue] = useState('');
  const [appVersion, setAppVersion] = useState('');

  
  const [limitPosts, setLimitPosts] = useState('');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingPa, setLoadingPa] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const role = localStorage.getItem('role');

  // Fetch settings from the backend
  const fetchSettings = async () => {
    try {
      const response = await axios.get('https://backend.sakanijo.com/get-settings-admin');
      if (response.data) {
        const settings = response.data
        setWhatsappLink(settings.whatsapp_link);
        setPhoneNumber(settings.phone_number);
        setCommissionValue(settings.commission_value);
        setAppVersion(settings.app_version)
        setLimitPosts(settings.defaultLimitPlaces)
      } else {
        setError('No settings found.');
      }
    } catch (er) {
      setError('Failed to fetch settings. Please try again.');
      console.error('Error fetching settings:', er);
    }
  };

  // Fetch categories from the backend
  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://backend.sakanijo.com/categories/admin/all');
      setCategories(response.data.categories);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchCategories();
  }, []);

  // Handle form submission for settings
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { whatsappLink, phoneNumber, commissionValue  , limitPosts , appVersion};

    try {
      const response = await axios.post('https://backend.sakanijo.com/update-settings', data);
      setSuccessMessage('تم حفظ البيانات بنجاح');
      console.log(response)
      setTimeout(() => setSuccessMessage(''), 3000); // Clear message after 3 seconds
    } catch (err) {
      setErrorMessage('فشل في حفظ البيانات. يرجى المحاولة مرة أخرى.');
      console.error('Error:', err);
    }
  };

  // Toggle category active state
  const toggleActiveState = async (index, slug) => {
    if (role !== 'admin') {
      alert('ليست لديك الصلاحية للقيام بهذه العملية');
      return;
    }

    try {
      await axios.put(`https://backend.sakanijo.com/categories/toggle/${slug}`);
      const updatedCategories = [...categories];
      updatedCategories[index].isActive = !updatedCategories[index].isActive;
      setCategories(updatedCategories);
    } catch (erro) {
      console.error('Error updating category:', erro);
    }
  };

  // Handle password change
  const handleChangePass = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMessage('كلمة المرور الجديدة غير متطابقة');
      return;
    }

    setLoadingPa(true);
    const token = localStorage.getItem('token');

    if (!token) {
      setErrorMessage('لم يتم العثور على رمز الدخول. يرجى تسجيل الدخول مرة أخرى.');
      return;
    }

    try {
      const response = await axios.post('https://backend.sakanijo.com/admin/update-password', {
        oldPassword,
        newPassword,
        token,
      });
      setSuccessMessage(response.data.message);
      setNewPassword('');
      setOldPassword('');
      setConfirmPassword('');
    } catch (err) {
      setErrorMessage(err.response?.data?.error || 'حدث خطأ. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoadingPa(false);
    }
  };

  if (error) return <Alert severity="error">{error}</Alert>;
  if (loading) return <CircularProgress />;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* Settings Section */}
      {role === 'admin' && (
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            الإعدادات الأساسية
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="رابط الواتساب"
                value={whatsappLink}
                onChange={(e) => setWhatsappLink(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="رقم الهاتف"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="حد المنشورات الافتراضي للمستخدمين"
                value={limitPosts}
                onChange={(e) => setLimitPosts(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="قيمة العمولة"
                value={commissionValue}
                onChange={(e) => setCommissionValue(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="رقم اصدار التطبيق"
                value={appVersion}
                onChange={(e) => setAppVersion(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                حفظ البيانات
              </Button>
            </Grid>
          </Grid>
          {successMessage && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {successMessage}
        </Alert>
      )}
        </Paper>
      )}
     

      {/* Password Change Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          تغيير كلمة المرور
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="password"
              label="كلمة المرور القديمة"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="password"
              label="كلمة المرور الجديدة"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="password"
              label="تأكيد كلمة المرور الجديدة"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleChangePass}
              disabled={loadingPa}
            >
              {loadingPa ? <CircularProgress size={24} /> : 'تغيير كلمة المرور'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Categories Section */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          تحكم في قوائم التطبيق
        </Typography>
        <Grid container spacing={2}>
          {categories.map((item, index) => (
            <Grid item xs={12} key={index}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 2,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  boxShadow: 1,
                }}
              >
                <Typography variant="body1">{item.slug}</Typography>
                <Switch
                  checked={item.isActive}
                  onChange={() => toggleActiveState(index, item.slug)}
                  color="primary"
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Success and Error Messages */}
      {successMessage && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errorMessage}
        </Alert>
      )}
    </Container>
  );
}