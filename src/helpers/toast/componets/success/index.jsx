import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export const SuccessMessage = ({ message, title }) => {
  return (
    <Box display="flex" alignItems="flex-start" gap={2}>
      <CheckCircleOutlineIcon sx={{ fontSize: 30, color: 'green', mt: 0.5 }} />

      <Box>
        <Typography variant="subtitle1" fontWeight={500} mb={0.5}>
          {title ?? 'Thành công!'}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      </Box>
    </Box>
  );
};

SuccessMessage.propTypes = {
  message: PropTypes.string.isRequired,
  title: PropTypes.string,
};
