import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext'; // Import AuthContext to handle logout

const Header = () => {
    const { logoutUser } = useContext(AuthContext); // Get logoutUser from AuthContext
    const navigate = useNavigate(); // To navigate back to landing page

    const handleLogout = () => {
        logoutUser(); // Perform the logout action
        navigate('/'); // Redirect to the landing page
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Financial Dashboard
                </Typography>
                <Button color="inherit" onClick={handleLogout}>Logout</Button> {/* Call handleLogout on click */}
            </Toolbar>
        </AppBar>
    );
};

export default Header;
