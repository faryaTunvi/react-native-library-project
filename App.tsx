import React, { useEffect, useState } from 'react';
import { Alert, NativeModules } from 'react-native';
import { UserData } from './interfaces/UserData';
import {
  createTable,
  fetchAndStoreUserData,
  getUserDataFromDB,
  deleteUser,
} from './database/db';
import UserListView from './screens/UserListView';
// Import the separated View logic

const NativeModuleService = NativeModules.AndroidModule;

function App() {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize Database and Table
  const initializeDatabase = async () => {
    try {
      await createTable();
      console.log('Database initialized successfully');
      await loadUserDataFromDB(); // Load existing data
    } catch (error) {
      console.error('Error initializing database:', error);
      Alert.alert('Error', 'Failed to initialize database');
    }
  };

  useEffect(() => {
    initializeDatabase();
  }, []);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      await fetchAndStoreUserData();
      await loadUserDataFromDB();
      Alert.alert('Success', 'User data fetched and stored successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch user data from native module');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserDataFromDB = async () => {
    try {
      const dbUserData = await getUserDataFromDB();
      setUserData(dbUserData);
    } catch (error) {
      console.error('Error loading user data from database:', error);
      Alert.alert('Error', 'Failed to load user data from database');
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      const success = await deleteUser(id);
      if (success) {
        Alert.alert('Success', 'User deleted successfully');
        await loadUserDataFromDB();
      } else {
        Alert.alert('Error', 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      Alert.alert('Error', 'Failed to delete user');
    }
  };

  return (
    <UserListView
      userData={userData}
      isLoading={isLoading}
      fetchUserData={fetchUserData}
      loadUserDataFromDB={loadUserDataFromDB}
      handleDeleteUser={handleDeleteUser}
      showToast={() => NativeModuleService.showToast('Android Toast: ', 0)}
    />
  );
}

export default App;