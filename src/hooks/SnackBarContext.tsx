import React, { createContext, useContext, ReactNode } from "react";
import { SnackbarProvider as NotistackSnackbarProvider, useSnackbar as useNotistackSnackbar, VariantType } from "notistack";

// Define the context type for your custom SnackbarProvider
interface SnackbarContextType {
    openSnackbar: (message: string, severity: VariantType) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

// Create a custom SnackbarProvider (rename it to avoid the conflict with notistack's SnackbarProvider)
export const CustomSnackbarProvider = ({ children }: { children: ReactNode }) => {
    const { enqueueSnackbar } = useNotistackSnackbar();

    // Function to open the snackbar using notistack
    const openSnackbar = (message: string, severity: VariantType) => {
        enqueueSnackbar(message, { variant: severity });
    };

    return (
        <SnackbarContext.Provider value={{ openSnackbar }}>
            {children}
        </SnackbarContext.Provider>
    );
};

export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error("useSnackbar must be used within a CustomSnackbarProvider");
    }
    return context;
};
