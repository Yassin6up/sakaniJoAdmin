import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';

import Nav from './nav';
import Main from './main';
import Header from './header';

// ----------------------------------------------------------------------

export default function DashboardLayout({ children }) {
  const [openNav, setOpenNav] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    axios.get('https://backend.sakanijo.com/api/admin/getData', { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        if (!response.data.user) {
          setOpenModal(true);
        }
      })
      .catch(() => {
        setOpenModal(true);
      });
  }, [navigate]);

  const handleCloseModal = () => {
    setOpenModal(false);
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      <Header onOpenNav={() => setOpenNav(true)} />

      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
        }}
      >
        <Nav openNav={openNav} onCloseNav={() => setOpenNav(false)} />
        <Main>{children}</Main>
      </Box>

      {/* Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ p: 3, bgcolor: 'background.paper', mx: 'auto', mt: 10, width: 300, textAlign: 'center' }}>
          <p>Someone has logged into your account.</p>
          <Button variant="contained" color="primary" onClick={handleCloseModal}>
            OK
          </Button>
        </Box>
      </Modal>
    </>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node,
};
