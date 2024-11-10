// At the top of SnackBarContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Snackbar, Alert } from "@mui/material";

// Your existing code below...

interface SnackbarContextType {
    openSnackbar: (message: string, severity: 'success' | 'error') => void;
    snackbarMessage: string;
    snackbarSeverity: 'success' | 'error';
    isSnackbarOpen: boolean;
    setSnackbarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setSnackbarMessage: React.Dispatch<React.SetStateAction<string>>;
    setSnackbarSeverity: React.Dispatch<React.SetStateAction<'success' | 'error'>>;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
    const [isSnackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const openSnackbar = (message: string, severity: 'success' | 'error') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    return (
      <SnackbarContext.Provider value={{
          openSnackbar,
          snackbarMessage,
          snackbarSeverity,
          isSnackbarOpen,
          setSnackbarOpen,
          setSnackbarMessage,
          setSnackbarSeverity
      }}>
          {children}

          {/* Material UI Snackbar Component */}
          <Snackbar
              open={isSnackbarOpen}
              autoHideDuration={6000} // Display time in ms (6 seconds)
              onClose={() => setSnackbarOpen(false)} // Close the Snackbar after duration
          >
              <Alert 
                  severity={snackbarSeverity} 
                  sx={{ width: '100%' }} 
                  onClose={() => setSnackbarOpen(false)} // Close on Alert click
              >
                  {snackbarMessage}
              </Alert>
          </Snackbar>
      </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error("useSnackbar must be used within a SnackbarProvider");
    }
    return context;
};