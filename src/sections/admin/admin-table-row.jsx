import axios from 'axios';
import { useState } from 'react';
import PropTypes from 'prop-types';

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

// ----------------------------------------------------------------------

export default function UserTableRow({ selected, name, onDelete, avatarUrl, phone, status, handleClick, id }) {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleDeleteUser = async () => {
    const deleteUserApi = `https://backend.sakanijo.com/admins/${id}`;
    const confirmed = window.confirm("هل أنت متأكد من حذف هذا المستخدم؟");

    if (confirmed) {
      try {
        const res = await axios.delete(deleteUserApi);
        if (res.status === 200) {
          console.log("تم حذف المستخدم بنجاح");
          onDelete(id);
        }
      } catch (error) {
        console.error("خطأ أثناء حذف المستخدم:", error);
      }
    } else {
      console.log("تم إلغاء عملية الحذف");
    }
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
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{phone}</TableCell>

        <TableCell>
          <Label color={(status === 'inactive' && 'error') || 'success'}>{status}</Label>
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
        <MenuItem onClick={() => handleDeleteUser()} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}

UserTableRow.propTypes = {
  avatarUrl: PropTypes.string,
  handleClick: PropTypes.func,
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  selected: PropTypes.bool,
  status: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired, // Add prop validation for onDelete
};
