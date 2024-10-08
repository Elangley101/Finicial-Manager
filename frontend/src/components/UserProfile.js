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
    console.log('Auth Tokens:', authTokens); // Log the tokens to see if they are available

    const fetchUserData = async () => {
      if (!authTokens) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:8000/api/users/profile/', {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        });
        setUserData(response.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError('User not authenticated');
        } else {
          setError('Failed to fetch user data');
        }
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
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
