import PropTypes from 'prop-types';

import { Typography } from '@mui/material';

export default function ProductInfo({ name, value, valueColor, nameColor }) {
  return (
    <>
      <Typography variant="h6" component="span" color={nameColor}>
        {name}:{' '}
      </Typography>
      <Typography component="span" color={valueColor}>
        {value}
      </Typography>
    </>
  );
}

ProductInfo.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  valueColor: PropTypes.string,
  nameColor: PropTypes.string,
};
