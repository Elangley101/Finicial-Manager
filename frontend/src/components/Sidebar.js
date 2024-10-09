import React from 'react';
import { Link } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';

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
                <ListItem button component={Link} to="/dashboard">
                    <ListItemIcon>
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem button component={Link} to="/budget">
                    <ListItemText primary="Budget" />
                </ListItem>
                <ListItem button component={Link} to="/accounts">
                    <ListItemIcon>
                        <AccountBalanceIcon />
                    </ListItemIcon>
                    <ListItemText primary="Accounts" />
                </ListItem>
                <ListItem button component={Link} to="/transactions">
                    <ListItemIcon>
                        <ReceiptIcon />
                    </ListItemIcon>
                    <ListItemText primary="Transactions" />
                </ListItem>
                <ListItem button component={Link} to="/profile">
                    <ListItemIcon>
                        <AccountCircleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
                </ListItem>
                <ListItem button component={Link} to="/reports">
                    <ListItemIcon>
                        <BarChartIcon />
                    </ListItemIcon>
                    <ListItemText primary="Reports" />
                </ListItem>
                <ListItem button component={Link} to="/settings">
                    <ListItemIcon>
                        <SettingsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Settings" />
                </ListItem>
            </List>
        </Drawer>
    );
};

export default Sidebar;
