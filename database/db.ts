import SQLite, { SQLiteDatabase} from 'react-native-sqlite-storage';
import { UserData } from '../interfaces/UserData';
import { NativeModules } from 'react-native';

// Enable SQLite debugging (optional)
SQLite.enablePromise(true);

let db: SQLiteDatabase;

const NativeModuleService = NativeModules.AndroidModule;

/**
 * Open or Create SQLite Database
 */
export const openDatabase = async (): Promise<SQLiteDatabase> => {
  if (!db) {
    try {
      db = await SQLite.openDatabase({
        name: 'MyDatabase.db',
        location: 'default', // Save database in default location
      });
      console.log('Database opened successfully!');
    } catch (error) {
      console.error('Error opening database:', error);
      throw error;
    }
  }
  return db;
};

/**
 * Create Table if it doesn't exist
 */
export const createTable = async (): Promise<void> => {
  const query = `
    CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL
    );
  `;
  try {
    const db = await openDatabase();
    await db.executeSql(query);
    console.log('Table created successfully.');
  } catch (error) {
    console.error('Error creating table:', error);
    throw error;
  }
};

/**
 * Fetch user data from native module and store in database
 */
export const fetchAndStoreUserData = async (): Promise<UserData> => {
  try {
    const userDataString = await NativeModuleService.getUserData();
    const parsedUserData: UserData = JSON.parse(userDataString);
    
    // Store in database
    await insertUserData(parsedUserData);
    
    return parsedUserData;
  } catch (error) {
    console.error('Error fetching and storing user data:', error);
    throw error;
  }
};

/**
 * Insert User Data into the "Users" table
 */
export const insertUserData = async (userData: UserData): Promise<number> => {
  try {
    const db = await openDatabase();
    const [result] = await db.executeSql(
      'INSERT OR REPLACE INTO Users (name, email) VALUES (?, ?);',
      [userData.name, userData.email]
    );
    console.log('User data inserted successfully with id:', result.insertId);
    return result.insertId || 0;
  } catch (error) {
    console.error('Error inserting user data:', error);
    throw error;
  }
};

/**
 * Insert User into the "Users" table
 */
export const insertUser = async (name: string, email: string): Promise<number> => {
  try {
    const db = await openDatabase();
    const [result] = await db.executeSql(
      'INSERT INTO Users (name, email) VALUES (?, ?);',
      [name, email]
    );
    console.log('User inserted successfully with id:', result.insertId);
    return result.insertId || 0;
  } catch (error) {
    console.error('Error inserting user:', error);
    throw error;
  }
};

/**
 * Fetch All Users from Database
 */
export const fetchUsers = async (): Promise<UserData[]> => {
  const query = 'SELECT * FROM Users ORDER BY id DESC;';
  try {
    const db = await openDatabase();
    const [result] = await db.executeSql(query);
    const users: UserData[] = [];
    result.rows.raw().forEach(row => users.push(row));
    console.log('Fetched Users:', users);
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Get User Data from Database
 */
export const getUserDataFromDB = async (): Promise<UserData[]> => {
  return await fetchUsers();
};

/**
 * Update User by ID
 */
export const updateUser = async (id: number, name: string, email: string): Promise<boolean> => {
  const query = 'UPDATE Users SET name = ?, email = ? WHERE id = ?;';
  try {
    const db = await openDatabase();
    const [result] = await db.executeSql(query, [name, email, id]);
    console.log('Number of rows updated:', result.rowsAffected);
    return result.rowsAffected > 0;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

/**
 * Delete User by ID
 */
export const deleteUser = async (id: number): Promise<boolean> => {
  const query = 'DELETE FROM Users WHERE id = ?;';
  try {
    const db = await openDatabase();
    const [result] = await db.executeSql(query, [id]);
    console.log('Number of rows deleted:', result.rowsAffected);
    return result.rowsAffected > 0;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};