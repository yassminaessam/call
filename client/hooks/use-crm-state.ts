import { useState, useCallback } from 'react';

// Global CRM State Management
interface CRMState {
  // Call Center
  activeCall: any | null;
  callDuration: number;
  
  // Notifications
  notifications: Notification[];
  
  // Search
  globalSearch: string;
  
  // User preferences
  sidebarCollapsed: boolean;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const initialState: CRMState = {
  activeCall: null,
  callDuration: 0,
  notifications: [],
  globalSearch: '',
  sidebarCollapsed: false,
};

export function useCRMState() {
  const [state, setState] = useState<CRMState>(initialState);

  const updateState = useCallback((updates: Partial<CRMState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    
    setState(prev => ({
      ...prev,
      notifications: [newNotification, ...prev.notifications].slice(0, 50) // Keep only latest 50
    }));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      )
    }));
  }, []);

  const clearNotifications = useCallback(() => {
    setState(prev => ({ ...prev, notifications: [] }));
  }, []);

  const startCall = useCallback((callData: any) => {
    updateState({ activeCall: callData, callDuration: 0 });
    
    // Start timer
    const timer = setInterval(() => {
      setState(prev => ({ ...prev, callDuration: prev.callDuration + 1 }));
    }, 1000);

    // Store timer reference
    (window as any).callTimer = timer;
  }, [updateState]);

  const endCall = useCallback(() => {
    if ((window as any).callTimer) {
      clearInterval((window as any).callTimer);
      delete (window as any).callTimer;
    }
    
    updateState({ activeCall: null, callDuration: 0 });
    
    addNotification({
      type: 'success',
      title: 'Call Ended',
      message: 'Call has been successfully logged and recorded.'
    });
  }, [updateState, addNotification]);

  return {
    state,
    updateState,
    addNotification,
    markNotificationRead,
    clearNotifications,
    startCall,
    endCall,
  };
}

// API utilities
export function useAPI() {
  const { addNotification } = useCRMState();

  const apiCall = useCallback(async (url: string, options: RequestInit = {}) => {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Operation completed successfully'
        });
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
      throw error;
    }
  }, [addNotification]);

  return { apiCall };
}

// Form utilities
export function useFormSubmit() {
  const { apiCall } = useAPI();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitForm = useCallback(async (endpoint: string, data: any, method: string = 'POST') => {
    setIsSubmitting(true);
    try {
      const result = await apiCall(endpoint, {
        method,
        body: JSON.stringify(data),
      });
      return result;
    } finally {
      setIsSubmitting(false);
    }
  }, [apiCall]);

  return { submitForm, isSubmitting };
}

// Export utilities
export function useExport() {
  const { addNotification } = useCRMState();

  const exportData = useCallback((data: any[], filename: string, format: 'csv' | 'json' = 'csv') => {
    try {
      let content: string;
      let mimeType: string;
      let extension: string;

      if (format === 'csv') {
        // Convert to CSV
        const headers = Object.keys(data[0] || {});
        const csvContent = [
          headers.join(','),
          ...data.map(row => headers.map(header => 
            JSON.stringify(row[header] || '')
          ).join(','))
        ].join('\n');
        
        content = csvContent;
        mimeType = 'text/csv';
        extension = 'csv';
      } else {
        content = JSON.stringify(data, null, 2);
        mimeType = 'application/json';
        extension = 'json';
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      addNotification({
        type: 'success',
        title: 'Export Complete',
        message: `Data exported to ${filename}.${extension}`
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Export Failed',
        message: 'Failed to export data. Please try again.'
      });
    }
  }, [addNotification]);

  return { exportData };
}

// Search utilities
export function useSearch<T>(data: T[], searchFields: (keyof T)[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(data);

  const search = useCallback((term: string) => {
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter(item =>
      searchFields.some(field => {
        const value = item[field];
        return value && 
          String(value).toLowerCase().includes(term.toLowerCase());
      })
    );

    setFilteredData(filtered);
  }, [data, searchFields]);

  return {
    searchTerm,
    filteredData,
    search,
    setSearchTerm,
  };
}
