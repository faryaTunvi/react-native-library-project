import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  FlatList,
} from 'react-native';
import { styles } from '../styles/NetworkInfoShowScreen.style';
import { UserData } from '../interfaces/UserData';

interface Props {
  userData: UserData[];
  isLoading: boolean;
  fetchUserData: () => void;
  loadUserDataFromDB: () => void;
  handleDeleteUser: (id: number) => void;
  showToast: () => void;
}

const UserListView: React.FC<Props> = ({
  userData,
  isLoading,
  fetchUserData,
  loadUserDataFromDB,
  handleDeleteUser,
  showToast,
}) => {
  const renderUserItem = ({ item }: { item: UserData }) => (
    <View style={[styles.textContainer, { marginVertical: 5 }]}>
      <Text style={styles.ContainerText}>User ID: {item.id}</Text>
      <Text style={styles.ContainerText}>Name: {item.name}</Text>
      <Text style={styles.ContainerText}>Email: {item.email}</Text>
      <TouchableOpacity
        onPress={() => handleDeleteUser(item.id)}
        style={[styles.button, { backgroundColor: '#ff4444', marginTop: 10 }]}>
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Fetch User Data Button */}
        <TouchableOpacity
          onPress={fetchUserData}
          style={[styles.button, { marginTop: 20 }]}
          disabled={isLoading}>
          <Text style={styles.buttonText}>
            {isLoading ? 'Loading...' : 'Fetch User Data'}
          </Text>
        </TouchableOpacity>

        {/* Load Data Button */}
        <TouchableOpacity
          onPress={loadUserDataFromDB}
          style={[styles.button, { marginTop: 10 }]}
          disabled={isLoading}>
          <Text style={styles.buttonText}>Load Data from DB</Text>
        </TouchableOpacity>

        {/* Show Toast Button */}
        <TouchableOpacity
          onPress={showToast}
          style={[styles.button, { marginTop: 10 }]}>
          <Text style={styles.buttonText}>Show Toast</Text>
        </TouchableOpacity>

        {/* User List */}
        {userData.length > 0 ? (
          <View style={{ marginTop: 20, flex: 1 }}>
            <Text
              style={[
                styles.ContainerText,
                { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
              ]}>
              Stored Users ({userData.length}):
            </Text>
            <FlatList
              data={userData}
              renderItem={renderUserItem}
              keyExtractor={(item) => item.id.toString()}
              nestedScrollEnabled={true}
            />
          </View>
        ) : (
          <View style={[styles.textContainer, { marginTop: 20 }]}>
            <Text style={styles.ContainerText}>
              No user data available. Fetch data to see results.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserListView;