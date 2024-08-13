// src/components/Sidebar.js

import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ReceiptIcon from '@mui/icons-material/Receipt';

const Sidebar = () => {
    return (
        <Drawer
            variant="permanent"
            sx={{
                width: 240,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
            }}
        >
            <List>
                <ListItem button>
                    <ListItemIcon>
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        <AccountBalanceIcon />
                    </ListItemIcon>
                    <ListItemText primary="Accounts" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        <ReceiptIcon />
                    </ListItemIcon>
                    <ListItemText primary="Transactions" />
                </ListItem>
            </List>
        </Drawer>
    );
};

export default Sidebar;
