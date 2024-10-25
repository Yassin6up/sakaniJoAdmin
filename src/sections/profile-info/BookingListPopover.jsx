/* eslint-disable perfectionist/sort-named-imports */

import PropTypes from "prop-types"
import { useTranslation } from "react-i18next";

import { IconButton, Popover, Stack, Box, Typography } from "@mui/material"

import Iconify from "src/components/iconify/iconify"

export default function BookingListPopover({ open, onClose }) {
    const { t } = useTranslation();
    return (
        <Popover
            id="add-product-popover"
            open={open}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'center',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'center',
                horizontal: 'center',
            }}
            PaperProps={{
                sx: {
                    width: '70%',
                },
            }}
        >
            <Box sx={{ padding: 1 }}>
                <Stack direction="row" padding={2} alignItems="center" justifyContent="space-between">
                    <Typography variant="h4">{t('booking_info_t')}</Typography>

                    <IconButton onClick={onClose}>
                        <Iconify icon="eva:close-fill" />
                    </IconButton>
                </Stack>
            </Box>
        </Popover>
    )
}

BookingListPopover.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func
}

