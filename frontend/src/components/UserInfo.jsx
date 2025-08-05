import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserInfo = () => {
  const { user } = useAuth();
  const [localStorageUser, setLocalStorageUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Lấy thông tin từ localStorage
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser) {
      try {
        setLocalStorageUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
      }
    }
    
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">User Information</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-gray-700">AuthContext User:</h3>
          <pre className="text-sm bg-gray-50 p-2 rounded mt-1 overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-700">LocalStorage User:</h3>
          <pre className="text-sm bg-gray-50 p-2 rounded mt-1 overflow-auto">
            {JSON.stringify(localStorageUser, null, 2)}
          </pre>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-700">JWT Token:</h3>
          <div className="text-sm bg-gray-50 p-2 rounded mt-1 break-all">
            {token ? token.substring(0, 50) + '...' : 'No token found'}
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-700">User ID Analysis:</h3>
          <div className="text-sm space-y-1">
            <div>AuthContext User ID: {user?.id}</div>
            <div>LocalStorage User ID: {localStorageUser?.id}</div>
            <div>Token exists: {token ? 'Yes' : 'No'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo; 