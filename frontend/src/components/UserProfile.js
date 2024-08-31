// src/components/UserProfile.js
import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Sidebar from './Sidebar';
import PersonalInformation from './PersonalInformation';
import AccountSettings from './AccountSettings';
import PasswordReset from './PasswordReset';

const UserProfile = () => {
  const { authTokens } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/users/profile/', {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        });
        setUserData(response.data);
      } catch (err) {
        setError('Failed to fetch user data');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (authTokens) {
      fetchUserData();
    } else {
      setLoading(false);
      setError('User not authenticated');
    }
  }, [authTokens]);

  if (loading) return <CircularProgress />;

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box display="flex">
      <Sidebar />
      <Box flexGrow={1} p={3}>
        <Typography variant="h4" gutterBottom>
          User Profile
        </Typography>
        <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
          <PersonalInformation userData={userData} />
        </Paper>
        <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
          <AccountSettings userData={userData} />
        </Paper>
        <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
          <PasswordReset />
        </Paper>
      </Box>
    </Box>
  );
};

export default UserProfile;
