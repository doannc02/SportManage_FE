import { Box, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate } from 'react-router-dom';
import { getAppToken } from '../configs/token';

const NotFoundPage = () => {
    const navigate = useNavigate();
    const tokenApp = getAppToken()
    const isAdmin = (tokenApp?.roles ?? []).includes('Admin')
    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            textAlign="center"
            bgcolor="#f9f9f9"
        >
            <ErrorOutlineIcon sx={{ fontSize: 100, color: '#ff6f61' }} />
            <Typography variant="h3" color="textPrimary" gutterBottom>
                404 - Page Not Found
            </Typography>
            <Typography variant="body1" color="textSecondary" mb={3}>
                Oops! The page you are looking for does not exist.
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    if (isAdmin) {
                        navigate('/admin')
                        return;
                    }
                    navigate('/')
                }}
            >
                Go Back to Home
            </Button>
        </Box>
    );
};

export default NotFoundPage;