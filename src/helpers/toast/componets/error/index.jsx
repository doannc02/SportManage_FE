import PropTypes from "prop-types";
import { Box, Typography, Divider } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

export const ErrorMessage = ({ message, title }) => {
  return (
    <Box display="flex" alignItems="flex-start" gap={2}>
      <HighlightOffIcon sx={{ fontSize: 30, color: "red", mt: 0.5 }} />

      <Box>
        <Typography variant="subtitle1" fontWeight={500} mb={0.5}>
          {title ?? "Hãy thử lại sau!!!"}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>

        <Divider sx={{ mt: 1, borderColor: "#dcdcdc" }} />
      </Box>
    </Box>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
  title: PropTypes.string,
};
