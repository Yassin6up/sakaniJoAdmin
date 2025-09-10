import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import axios from "axios"
import Iconify from 'src/components/iconify';

import FilterModal from './filterModal';

import SendNotificationModal from "./sendNotification"
// ----------------------------------------------------------------------

export default function UserTableToolbar({ numSelected, filterName, onFilterName, onApplyFilters , selectedUsers  }) {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);

  const [notificationOpen, setModalNotification] = useState(false);


  const handleSendNotification = async (notificationData) => {
    try {
      console.log(notificationData)
      await axios.post('https://backend.sakanijo.com/send-notification', notificationData);
      alert(t('Notification sent successfully!'));
    } catch (error) {
      console.error('Error sending notification:', error);
      alert(t('Error sending notification'));
    }
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleOpenModalNot = () => {
    setModalNotification(true);
  };

  const handleCloseModalNot = () => {
    setModalNotification(false);
  };

  const handleApplyFilters = (filters) => {
    onApplyFilters(filters);
  };

  return (
    <>
      <Toolbar
        sx={{
          height: 96,
          display: 'flex',
          justifyContent: 'space-between',
          p: (theme) => theme.spacing(0, 1, 0, 3),
          ...(numSelected > 0 && {
            color: 'primary.main',
            bgcolor: 'primary.lighter',
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography component="div" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : (
          <OutlinedInput
            value={filterName}
            onChange={onFilterName}
            placeholder={t('search_user_t')}
            startAdornment={
              <InputAdornment position="start">
                <Iconify
                  icon="eva:search-fill"
                  sx={{ color: 'text.disabled', width: 20, height: 20 }}
                />
              </InputAdornment>
            }
          />
        )}

        {numSelected > 0 ? (
          <Tooltip title={t('Send Notification')}>
            <IconButton onClick={() => setModalNotification(true)}>
              <Iconify icon="mdi:bell-alert-outline" />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Filter list">
            <IconButton onClick={handleOpenModal}>
              <Iconify icon="ic:round-filter-list" />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>

      <SendNotificationModal
        open={notificationOpen}
        onClose={() => setModalNotification(false)}
        selectedUsers={selectedUsers}
        onSubmit={handleSendNotification}
      />

      <FilterModal open={modalOpen} onClose={handleCloseModal} onApplyFilters={handleApplyFilters} />
    </>
  );
}

UserTableToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onApplyFilters: PropTypes.func,
  selectedUsers: PropTypes.array,

};