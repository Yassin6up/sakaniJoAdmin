import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import Modal from '@mui/material/Modal';
import { fCurrency } from 'src/utils/format-number';
import Label from 'src/components/label';

export default function ShopProductCard({ product }) {
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const renderStatus = (
    <Label
      variant="filled"
      color="info"
      sx={{
        zIndex: 9,
        top: 16,
        right: 16,
        position: 'absolute',
        textTransform: 'uppercase',
      }}
    >
      {product?.home_type}
    </Label>
  );

  const notAccepted = (
    <Label
      variant="filled"
      color="warning"
      sx={{
        zIndex: 9,
        top: 16,
        left: 16,
        position: 'absolute',
        textTransform: 'uppercase',
        color: 'white',
      }}
    >
      غير مفعلة
    </Label>
  );

  const sponsoredBadge = (
    <Label
      variant="filled"
      sx={{
        zIndex: 9,
        bottom: 16,
        right: 16,
        position: 'absolute',
        textTransform: 'uppercase',
        background: 'linear-gradient(45deg, #FFD700, #DAA520)', // Golden gradient
        color: 'white',
      }}
    >
      ممول
    </Label>
  );

  const photos = product?.photos ? product.photos.split(',') : [];
  const allPhotos = [];
  photos.forEach((element, index) => {
    allPhotos.push(`https://backend.sakanijo.com/api/images/${encodeURIComponent(product.folderName)}/${encodeURIComponent(photos[index])}`);
  });

  const renderImg = (
    <Box
      sx={{
        top: 0,
        width: '100%',
        height: 1,
        objectFit: 'cover',
        position: 'absolute',
        overflow: 'hidden',
      }}
    >
      <img src={`https://backend.sakanijo.com/api/images/${encodeURIComponent(product.folderName)}/${encodeURIComponent(photos[0])}`} alt="#photo" />
    </Box>
  );

  const renderPrice = (
    <Typography variant="subtitle1">
      <Typography
        component="span"
        variant="body1"
        sx={{
          color: 'text.disabled',
          textDecoration: 'line-through',
        }}
      >
        {product?.priceSale && product?.priceSale}
      </Typography>
      JOD
      {product?.price}
    </Typography>
  );

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {renderStatus}
        {renderImg}
        {product?.approved === 0 ? notAccepted : null}
        {product?.sponsored === 1 ? sponsoredBadge : null} {/* Sponsored badge */}
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link
          href={`product_info?id=${product?.id}`}
          color="inherit"
          underline="hover"
          variant="subtitle2"
          noWrap
        >
          {product?.title}
        </Link>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {renderPrice}
        </Stack>
      </Stack>

      <Modal
        open={showModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {product?.title}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            السعر: {product?.price}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            وصف المنتج: {product?.description}
          </Typography>

          <Link to="/LoginView">
            <Button
              variant="contained"
              sx={{
                backgroundColor: 'black',
                color: 'white',
                width: '100%',
                mt: 2,
                '&:hover': {
                  backgroundColor: 'darkgrey',
                },
              }}
            >
              حجز
            </Button>
          </Link>
        </Box>
      </Modal>
    </Card>
  );
}

ShopProductCard.propTypes = {
  product: PropTypes.object,
};