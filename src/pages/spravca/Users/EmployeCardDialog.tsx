import React, { useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
    Select,
    MenuItem,
    Typography,
} from "@mui/material";

interface EmployeeCardDialogProps {
    open: boolean;
    handleClose: () => void;
}

const EmployeeCardDialog: React.FC<EmployeeCardDialogProps> = ({ open, handleClose }) => {
    // Local state for form fields
    const [formData, setFormData] = useState({
        birthDate: "1990-08-23",  // Set initial values
        position: "Accountant",
    });

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>Zamestnanecká karta</DialogTitle>
            <DialogContent>
                <Box>
                    <Typography variant="body1" fontWeight="bold">
                        Meno:
                    </Typography>
                    <Typography variant="body1">
                        Priezvisko:
                    </Typography>
                </Box>

                <Grid container spacing={2} sx={{ marginTop: 2 }}>
                    {/* Form Fields */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Dátum narodenia"
                            type="date"
                            fullWidth
                            name="birthDate"  // Use name for identifying the field
                            value={formData.birthDate}  // Bind value to state
                            onChange={handleChange}  // Handle state change
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Pracovná pozícia"
                            fullWidth
                            name="position"  // Use name for identifying the field
                            value={formData.position}  // Bind value to state
                            onChange={handleChange}  // Handle state change
                        />
                    </Grid>

                    {/* Add other fields here as needed */}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="primary" onClick={handleClose}>
                    Uložiť
                </Button>
                <Button variant="outlined" color="secondary" sx={{backgroundColor:"gray"}} onClick={handleClose}>
                    Zrušiť
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EmployeeCardDialog;
