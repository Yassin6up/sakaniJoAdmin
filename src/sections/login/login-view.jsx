import axios from "axios"
import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function LoginView() {
  const theme = useTheme();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State to hold error message
  const [loading, setLoading] = useState(false); // State to manage loading state

  const handleClick = async () => {
    setLoading(true);
    setErrorMessage(''); // Reset error message

    try {
      const response = await axios.post('https://backend.sakanijo.com/api/admin/login', {
        phone,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
    
      const {data} = response;
    
      if (response.status === 200) {
        console.log(data)
        // Save token to localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('name', data.admin.name);
        localStorage.setItem('phone', data.admin.phone);
        localStorage.setItem('role', data.admin.role);

        router.push('/');
      } else {
        // Handle login error (e.g., show an error message)
        setErrorMessage(data.message || 'فشل تسجيل الدخول');
      }
    } catch (error) {
      console.log(error);
      setErrorMessage(error.response.data.message);
    } finally {
      setLoading(false);
    }

  };

  const renderForm = (
    <>
      <Stack spacing={3}>
        <TextField
          name="phone"
          label="رقم الهاتف"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <TextField
          name="password"
          label="كلمة المرور"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Error message display */}
        {errorMessage && (
          <Typography variant="body2" color="error">
            {errorMessage}
          </Typography>
        )}
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleClick}
        loading={loading}
      >
        تسجيل الدخول
      </LoadingButton>
    </>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4">تسجيل الدخول إلى سكني جو</Typography>

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
