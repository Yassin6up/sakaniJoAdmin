import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { Container, Grid, Typography, Switch , Box } from '@mui/material';


export default function SettingPage() {

  const [whatsappLink, setWhatsappLink] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [commissionValue, setCommissionValue] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  const fetchSettings = async () => {
    try {
      const response = await axios.get('https://backend.sakanijo.com/get-settings'); // Update with your actual API URL
      if (response.data.length > 0) {
        const settings = response.data[0]; // Assuming you want the first setting object
        setWhatsappLink(settings.whatsapp_link);
        setPhoneNumber(settings.phone_number);
        setCommissionValue(settings.commission_value);
      } else {
        console.error('No settings found.');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      alert('Failed to fetch settings. Please try again.');
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);



  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      whatsappLink,
      phoneNumber,
      commissionValue,
      oldPassword,
      newPassword,
    };

    // Example API call to send data to backend
    fetch('https://backend.sakanijo.com/update-settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data1 => {
        // Handle success (e.g., show a success message)
        console.log('Success:', data1);
        alert("تم حفض البينات بنجاح")
      })
      .catch(error => {
        // Handle error (e.g., show an error message)
        console.error('Error:', error);
      });
  };


const role = localStorage.getItem("role")





  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null);     // Error state
  const [loadingPa, setLoadingPa] = useState(false);     // Error state

  // useEffect to make the API call when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://backend.sakanijo.com/categories/admin/all');  // Fetch data from your API
        setCategories(response.data.categories);              // Set the response data into state
        setLoading(false);                                    // Set loading to false
      } catch (err) {
        console.log("err",err)
        setError(err.message);                                // Handle any errors
        setLoading(false);
      }
    };

    fetchCategories();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  // If there's an error, show it
  if (error) return <div>Error: {error}</div>;

  // If still loading, show loading text
  if (loading) return <div>Loading...</div>;


  const toggleActiveState = async (index, slug) => {

    if(role === 'admin'){

      try {
        // Make a PUT request to your backend to toggle the isActive state
        await axios.put(`https://backend.sakanijo.com/categories/toggle/${slug}`);
        
        // Update the state locally after a successful API call
        const updatedMenuItems = [...categories];
        updatedMenuItems[index].isActive = !updatedMenuItems[index].isActive;
        setCategories(updatedMenuItems);
    
      } catch (error2) {
        console.error('Error updating category:', error2);
        // Optionally handle error, e.g., show error message to the user
      }
  
    }else{
      alert("ليست لديك الصلاحية للقيام بهاته العملية")
    }


  };


  const handleChangePass = async () => {
    setLoadingPa(true)
    const token = localStorage.getItem('token'); // Get the token from localStorage

    if (!token) {
      alert('No token found, please log in again.');
      return;
    }

    try {
      const response = await axios.post(
        'https://backend.sakanijo.com/admin/update-password', // Update with your actual API URL
        {
          oldPassword,
          newPassword,
          token, // Send token in the request body
        }
      );

      alert(response.data.message); // Show success message
      setLoadingPa(false)
      setNewPassword("")
      setOldPassword("")
      setConfirmPassword("")
    } catch (err) {
      if (err.response) {
        
        alert(err.response.data.error); // Show error message from server
      } else {
        alert('An error occurred. Please try again.');
      }
      setNewPassword("")
      setOldPassword("")
      setConfirmPassword("")
      console.log(err)
      setLoadingPa(false)
    }
  };


  return (
    <>
     <div
      style={{
        padding: '20px',
        width: '100%',
        maxWidth: '800px',
        margin: 'auto',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        right: '0',
        top: '20px',
      }}
    >
    {role === "admin"?
      <>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>الاعدادات الاساسية</h2>
        <div style={{ marginBottom: '15px' }}>
          <p style={{ display: 'block', marginBottom: '5px' }}>رابط الواتساب:</p>
          <input
            type="text"
            value={whatsappLink}
            onChange={(e) => setWhatsappLink(e.target.value)}
            placeholder="أدخل رابط الواتساب"
            style={{
              width: '100%',
              padding: '15px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <p style={{ display: 'block', marginBottom: '5px' }}>رقم الهاتف:</p>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="أدخل رقم الهاتف"
            style={{
              width: '100%',
              padding: '15px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <p style={{ display: 'block', marginBottom: '5px' }}>قيمة العمولة:</p>
          <input
            type="text"
            value={commissionValue}
            onChange={(e) => setCommissionValue(e.target.value)}
            placeholder="أدخل قيمة العمولة"
            style={{
              width: '100%',
              padding: '15px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <button
        type="button"
          style={{
            width: '100%',
            padding: '15px',
            fontSize: '16px',
            color: '#fff',
            backgroundColor: '#007BFF',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          onClick={handleSubmit}
        >
          حفظ البيانات
        </button>

        </>
    :
    null}

        <div style={{ marginBottom: '15px' }}>
          <p style={{ display: 'block', marginBottom: '5px' }}>كلمة المرور القديمة:</p>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="أدخل كلمة المرور القديمة"
            style={{
              width: '100%',
              padding: '15px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <p style={{ display: 'block', marginBottom: '5px' }}>كلمة المرور الجديدة:</p>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="أدخل كلمة المرور الجديدة"
            style={{
              width: '100%',
              padding: '15px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <p style={{ display: 'block', marginBottom: '5px' }}>تأكيد كلمة المرور الجديدة:</p>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="أعد إدخال كلمة المرور الجديدة"
            style={{
              width: '100%',
              padding: '15px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <button
          type="button"
          style={{
            width: '100%',
            padding: '15px',
            fontSize: '16px',
            color: '#fff',
            backgroundColor: '#007BFF',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          onClick={handleChangePass}
        >
        {
          loadingPa ?
          <p>
          جاري تحميل ...
          </p>
          :
          <p>
          تغير كلمة المرور
          </p>
        }
        </button>
      
    </div>

    <Box
      sx={{
        marginTop: '40px',          // Custom margin top
        padding: '20px',            // Padding inside the container
        backgroundColor: '#f5f5f5', // Light grey background color
        borderRadius: '10px',       // Rounded corners
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // Subtle shadow for a lifted look
      }}
    >
      {/* Title of the container */}
      <Typography variant="h4" align="center" gutterBottom>
      تحكم في قوائم التطبيق  
      </Typography>

      {/* Menu Items */}
      <Container>
        {categories.map((item, index) => (
          <Grid
            container
            key={index}
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
            style={{ marginBottom: '10px' }}
          >
            <Grid item>
              <Typography variant="h6">{item.slug}</Typography>
            </Grid>
            <Grid item>
              <Switch
                checked={item.isActive}
                onChange={() => toggleActiveState(index , item.slug)}
                color="primary"
              />
            </Grid>
            
          </Grid>
        ))}
      </Container>
    </Box>
    </>
  );
}