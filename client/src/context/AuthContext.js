import React, { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');  
      console.log("on auth file") 
      console.log(storedUser)
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Failed to parse user from localStorage:', error);
      return null;
    }
  });
    
  const updateUser = (data) => {
    setCurrentUser(data); // Update the current user in the state
   
  };

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('user'); // Clear user data when null
      }
    } catch (error) {
      console.error('Failed to update user in localStorage:', error);
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ updateUser, currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
