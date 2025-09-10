import PorpTypes from 'prop-types';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

// ----------------------------------------------------------------------

const LANGS = [
  {
    value: 'en',
    label: 'English',
    icon: '/assets/icons/ic_flag_en.svg',
  },
  {
    value: 'ar',
    label: 'Arabic',
    icon: '/assets/icons/ic_flag_ar.png',
  },
];

// ----------------------------------------------------------------------

/**
 * @typedef {Object} LanguagePopoverProps
 * @property {(value)=>void} onSelect
 */

/**
 *
 * @param {LanguagePopoverProps} props
 */
export default function LanguagePopover(props) {
  const [open, setOpen] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    props?.onSelect?.(LANGS[selectedIndex]);
  }, [selectedIndex, props]);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          ...(open && {
            bgcolor: 'action.selected',
          }),
        }}
      >
        <img src={LANGS[selectedIndex].icon} alt={LANGS[selectedIndex].label} />
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 180,
          },
        }}
      >
        {LANGS.map((option, index) => (
          <MenuItem
            key={option.value}
            selected={option.value === LANGS[selectedIndex].value}
            onClick={() => {
              handleClose();
              setSelectedIndex(index);
            }}
            sx={{ typography: 'body2', py: 1 }}
          >
            <Box component="img" alt={option.label} src={option.icon} sx={{ width: 28, mr: 2 }} />
            {option.label}
          </MenuItem>
        ))}
      </Popover>
    </>
  );
}

LanguagePopover.propTypes = {
  onSelect: PorpTypes.func,
};
