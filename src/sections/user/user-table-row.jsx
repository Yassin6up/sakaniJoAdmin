import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import UpdateUserModal from 'src/layouts/UserUpdateModal';
// مكون UserTableRow
export default function UserTableRow({ selected,bookingCount , created, postsCount,favoritesCount, name, avatarUrl, phone, status, handleClick, id, onDelete }) {
  const [open, setOpen] = useState(null);
 const [userName , setName] = useState(name)
 const [phoneNumber , setPhone] = useState(phone)

 const navigate = useNavigate();
  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };
  
  const handleDeleteUser = async () => {
    const deleteUserApi = `https://backend.sakanijo.com/admin/delete/users/${id}`;

    const confirmed = window.confirm("هل أنت متأكد من حذف هذا المستخدم؟");
    
    if (confirmed) {
      try {
        const res = await axios.post(deleteUserApi);
        if (res.status === 200) {
          console.log("تم حذف المستخدم بنجاح");
          onDelete(id); // استدعاء دالة الحذف في المكون الأب
        }
      } catch (error) {
        console.error("خطأ أثناء حذف المستخدم:", error);
      }
    } else {
      console.log("تم إلغاء عملية الحذف");
    }
  };


  const userData = {
     name,
    phone,
     postsCount,
    bookingsCount: bookingCount,
     favoritesCount,
    joinedDate: created
  };
  const [isModalVisible, setIsModalVisible] = useState(false);
   
  const handleUpdateUser = async(updatedData) => {
    try {
      // Prepare the data to be sent in the request
      const formData = {
        name: updatedData.name,
        phone: updatedData.phone,
        userId : id
      };
  
      // If password is provided, include it in the request
      if (updatedData.password) {
        formData.password = updatedData.password;
      }
  
      // Make the Axios request to update user data
      const response = await axios.put(`https://backend.sakanijo.com/api/users/update`, formData);
  
      if (response.status === 200) {
        setName(updatedData.name)
        setPhone( updatedData.phone)
        alert('تم تعديل بنجاح');
      } else {
        alert('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user');
    }
    setIsModalVisible(false);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={name} src={avatarUrl} />
            <Typography onClick={()=>{
                // navigate(`/profile_info?id=${id}`)
            }}  variant="subtitle2" noWrap >
              {userName} 
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{phoneNumber}</TableCell>

        <TableCell>
          <Label color={(!status && 'error') || 'success'}>{status? "تم تحقق":  "غير معتمد"}</Label>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={()=>{
          setIsModalVisible(true)
          handleCloseMenu()
        }}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          تعديل
        </MenuItem>
       
        <MenuItem onClick={handleDeleteUser} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          حدف
        </MenuItem>
      </Popover>

      <UpdateUserModal
      open={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        userData={userData}
        onUpdate={handleUpdateUser}

      />

      
    </>
  );
}

UserTableRow.propTypes = {
  avatarUrl: PropTypes.any,
  handleClick: PropTypes.func,
  name: PropTypes.any,
  id: PropTypes.any,
  postsCount : PropTypes.any ,
  bookingCount : PropTypes.any ,
  favoritesCount : PropTypes.any ,
  selected: PropTypes.any,
  created : PropTypes.any,
  status: PropTypes.string,
  phone: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
};