import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Stack, Tooltip, IconButton } from "@mui/material";
import { DataGridPro, GridColDef } from "@mui/x-data-grid-pro";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import { Label } from "@mui/icons-material";
import Layout from "../../components/Layout";

const ManageFeedback: React.FC = () => {
    const nav = useNavigate();
    return (
        <Layout>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Spätná väzba
            </Typography>
            <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginBottom: 2 }}
                    onClick={() => nav("/newFeedback")}
                >
                    Vytvoriť požiadavku spätnej väzby
            </Button>  
            <Stack direction="row" spacing={2}>
                <Button color="primary"
                        sx={{ marginBottom: 2 }}
                        onClick={() => nav("/newFeedback")} 
                        variant="outlined">
                Doručená spätná väzba
                </Button>
                <Button color="primary"
                        sx={{ marginBottom: 2 }}
                        onClick={() => nav("/newFeedback")} 
                        variant="outlined">
                Požiadavky spätnej väzby
                </Button>
            </Stack>
        </Layout>
    );
};

export default ManageFeedback;
