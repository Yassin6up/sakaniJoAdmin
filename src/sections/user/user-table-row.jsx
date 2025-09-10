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
export default function UserTableRow({ sponsoredCount,picture_url , onRemoveUser ,   description,selected,bookingCount , changeLimitPost , limitPosts , trustable , created, postsCount,favoritesCount, name,blocked , avatarUrl, phone, status, handleClick, id, onDelete , onTrust }) {
  const [open, setOpen] = useState(null);
 const [userName , setName] = useState(name)
 const [phoneNumber , setPhone] = useState(phone)
 const [desc , setDescription] = useState(description)

 const navigate = useNavigate();
  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };
  

  const handleRemoveUser = async () => {
/* eslint-disable no-restricted-globals */
const sure = confirm("هل انت متاكد من حدف " ,name)
/* eslint-enable no-restricted-globals */

    if(!sure){

      return ;
    }

    const deleteUserApi = `https://backend.sakanijo.com/admin/delete/users/${id}`;
    
      try {
        const res = await axios.post(deleteUserApi);
        if (res.status === 200) {
          onRemoveUser(id); // استدعاء دالة الحذف في المكون الأب
        }
      } catch (error) {
        console.error("خطأ أثناء حذف المستخدم:", error);
      }
    
  };


  const handleDeleteUser = async () => {
    const deleteUserApi = `https://backend.sakanijo.com/toggle_blocked/${id}`;
    
      try {
        const res = await axios.post(deleteUserApi);
        if (res.status === 200) {
          onDelete(id , res.data.blocked); // استدعاء دالة الحذف في المكون الأب
        }
      } catch (error) {
        console.error("خطأ أثناء حذف المستخدم:", error);
      }
    
  };

  const handelTrustUser = async () => {
    const trustUrl = `https://backend.sakanijo.com/toggle_trustable/${id}`;
    
      try {
        const res = await axios.post(trustUrl);
        if (res.status === 200) {
          onTrust(id , res.data.trustable); // استدعاء دالة الحذف في المكون الأب
        }
      } catch (error) {
        alert(error)
        console.error("خطأ أثناء حذف المستخدم:", error);
      }
    
  };

  
  const userData = {
     name,
    phone,
     postsCount,
     description,
    bookingsCount: bookingCount,
     favoritesCount,
    joinedDate: created , 
    limitPosts
  };
  const [isModalVisible, setIsModalVisible] = useState(false);
   
  const handleUpdateUser = async(updatedData) => {
    try {
      // Prepare the data to be sent in the request
      const formData = {
        name: updatedData.name,
        phone: updatedData.phone,
        limitPosts : updatedData.limitPosts ,
        description : updatedData.description ,
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
        setDescription(updatedData.description)
        changeLimitPost(id , updatedData.limitPosts ,updatedData.description )
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
            <Avatar alt={name} src={  +picture_url === 100 ? `https://backend.sakanijo.com/api/images/profiles/${encodeURIComponent(avatarUrl)}` : null} />
            <Typography onClick={()=>{
                // navigate(`/profile_info?id=${id}`)
            }}  variant="subtitle2" noWrap >
              {userName} 
              {trustable === 1 ? <Iconify icon="material-symbols-light:verified" sx={{ mr: 2 , color:'#0095F6' }} />
              :null}
              {blocked === 1 ? <Iconify icon="material-symbols-light:block" sx={{ mr: 2 , color:'red' }} />
              :null}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{phoneNumber}</TableCell>

        <TableCell>
          <Label color={(!status && 'error') || 'success'}>{status? "تم تحقق":  "غير معتمد"}</Label>
        </TableCell>

        <TableCell>{postsCount}</TableCell>
        <TableCell>{sponsoredCount}</TableCell>
        <TableCell>{bookingCount}</TableCell>

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
          navigate(`/profile_info?userId=${id}`)
        }}>
          <Iconify icon="material-symbols:user-attributes" sx={{ mr: 2 }} />
          الملف الشخصي
        </MenuItem>

        <MenuItem onClick={()=>{
          setIsModalVisible(true)
          handleCloseMenu()
        }}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          تعديل
        </MenuItem>


        {
          id !== 1&&(
            <>
            <MenuItem onClick={handelTrustUser} sx={ trustable === 1 ?{color:"red"} :  { color: '#0095F6' }}>
{
  trustable === 1 ?  "ازالة التوتيق" :<> 
  <Iconify icon="material-symbols-light:verified" sx={{ mr: 2 }} />
    توتيق </> 
}

          
        </MenuItem>

                   
        <MenuItem onClick={handleDeleteUser} sx={ blocked === 1 ?{color:"green"} :  { color: 'error.main' }}>
{
  blocked === 1 ?  "فك الحضر" :<> 
  <Iconify icon="material-symbols-light:block" sx={{ mr: 2 }} />
  حظر </> 
}

          
        </MenuItem>


            <MenuItem onClick={handleRemoveUser} sx={{ color: 'error.main' }}>

<Iconify icon="material-symbols-light:delete" sx={{ mr: 2 }} />
حذف

        
      </MenuItem>
      </>
          )
        }







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
  blocked: PropTypes.any,
  limitPosts : PropTypes.any,
  trustable : PropTypes.any,
  postsCount : PropTypes.any ,
  bookingCount : PropTypes.any ,
  favoritesCount : PropTypes.any ,
  selected: PropTypes.any,
  description : PropTypes.any , 
  created : PropTypes.any,
  picture_url:PropTypes.any,
  status: PropTypes.string,
  sponsoredCount : PropTypes.any ,
  phone: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
  onTrust : PropTypes.func.isRequired,
  onRemoveUser : PropTypes.func.isRequired,
  changeLimitPost : PropTypes.func.isRequired,
};