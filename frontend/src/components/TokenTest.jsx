import React, { useState } from 'react';
import axiosClient from '../services/axiosClient';

const TokenTest = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testToken = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/auth/test-token');
      console.log('Token test response:', response.data);
      setResult(response.data);
    } catch (error) {
      console.error('Token test error:', error);
      setResult({
        success: false,
        error: error.message,
        response: error.response?.data
      });
    } finally {
      setLoading(false);
    }
  };

  const testNotificationAPI = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.put('/users/2/notifications/read-all');
      console.log('Notification API response:', response.data);
      setResult(response.data);
    } catch (error) {
      console.error('Notification API error:', error);
      setResult({
        success: false,
        error: error.message,
        response: error.response?.data
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Test JWT Token & API</h2>
      
      <div className="space-y-4">
        <div>
          <button
            onClick={testToken}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test JWT Token'}
          </button>
        </div>
        
        <div>
          <button
            onClick={testNotificationAPI}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Notification API'}
          </button>
        </div>
        
        {result && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Test Result:</h3>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenTest; 