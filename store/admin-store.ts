import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback, useEffect } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { database } from '@/config/firebase';

export const [AdminProvider, useAdmin] = createContextHook(() => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<string>('');
  
  // Sync admin status with Firebase
  useEffect(() => {
    const adminStatusRef = ref(database, 'adminStatus');
    
    // Initial load and real-time updates
    const unsubscribe = onValue(adminStatusRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setIsLoggedIn(data.isLoggedIn || false);
        setAdminUser(data.adminUser || '');
      }
    });
    
    return () => unsubscribe();
  }, []);

  const login = useCallback((username: string, password: string) => {
    // Simple admin credentials - in production, this should be secure
    if (username === 'admin' && password === 'admin123') {
      setIsLoggedIn(true);
      setAdminUser(username);
      
      // Update Firebase
      const adminStatusRef = ref(database, 'adminStatus');
      set(adminStatusRef, { isLoggedIn: true, adminUser: username });
      
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setAdminUser('');
    
    // Update Firebase
    const adminStatusRef = ref(database, 'adminStatus');
    set(adminStatusRef, { isLoggedIn: false, adminUser: '' });
  }, []);

  return {
    isLoggedIn,
    adminUser,
    login,
    logout,
  };
});