// src/components/Header.js

import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Header = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Financial Dashboard
                </Typography>
                <Button color="inherit">Logout</Button>
            </Toolbar>
        </AppBar>
    );
};

export default Header;