import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Stack, Tooltip, IconButton, TextField, Modal, List, ListItem, ListItemText } from "@mui/material";
import { DataGridPro, GridColDef } from "@mui/x-data-grid-pro";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import { Label } from "@mui/icons-material";
import Layout from "../../components/Layout";
import UserProfile from "../../types/UserProfile";
import EmployeeCardDialog from "../spravca/Users/EmployeCardDialog";
import { EmployeeCard } from "../../types/EmployeeCard";

const NewFeedback: React.FC = () => {   
    const [openModal, setOpenModal] = useState(false);
    const [employees, setEmployees] = useState<EmployeeCard[]>([]);
    const [selectedEmployees, setSelectedEmployees] = useState<EmployeeCard[]>([]);
    const [question, setQuestion] = useState<string>('');
    const [questions, setQuestions] = useState<string[]>([]);
    const [notification, setNotification] = useState(false);
    const [showInput, setShowInput] = useState(false); // State to control visibility of the input field
    const [openCardDialog, setOpenCardDialog] = useState(false);
    const [openGoalDetailsDialog, setOpenGoalDetailsDialog] = useState(false); // Modal state
    const [selectedEmployee, setSelectedEmployee] = useState<EmployeeCard | null>(null); // For showing employee card dialog

    const [openEmployeesModal, setOpenEmployeesModal] = useState(false); 
    const nav = useNavigate();

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Meno', width: 150 },
        { field: 'surname', headerName: 'Priezvisko', width: 150 },
        { field: 'email', headerName: 'Email', width: 200 },
    ];


    const handleAddEmployee = (employee: EmployeeCard) => {
        setSelectedEmployees([...selectedEmployees, employee]);
    };
 
    const handleAddQuestion = () => {
        if (question) {
            setQuestions([...questions, question]);
            setQuestion('');
            setShowInput(false);
        }
    };
 
    const handleDeleteQuestion = (index: Number) => {
        const newQuestions = questions.filter((_, i) => i !== index);
        setQuestions(newQuestions);
    };
 
    const handleSubmit = () => {
        if (questions.length > 0) {
            console.log("Otazky");
            console.log(questions);
            console.log("Zamestnanci");
            console.log(employees);
            // Logic to send feedback request
            setNotification(true);
            // Reset form
            setSelectedEmployees([]);
            setQuestions([]);
        }
    };
 
    const handleCloseNotification = () => {
        setNotification(false);
    };
 
    return (
        <Layout>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Vytvoriť požiadavku spätnej väzby
            </Typography>
            <Stack direction="row" spacing={2} sx={{ marginBottom: 2 }}>
                <Button onClick={() => setOpenModal(true)} variant="contained" color="primary">
                    Pridať zamestnanca
                </Button>
            </Stack>
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                {/* Modal content for employee selection */}
                <p>Pridaný zamestnanec: {selectedEmployees.join(', ')}</p>
            </Modal>
            {/* Render DataGrid only if selectedEmployees is not empty */}
            {selectedEmployees.length > 0 && (
                <Box sx={{ height: 400, width: '100%', marginTop: 2 }}>
                    <DataGridPro
                        rows={selectedEmployees}
                        columns={columns}
                    />
                </Box>
            )}
            {showInput ? (
                
                <TextField 
                    label={"Otázka"}
                    value={question} 
                    onChange={(e) => setQuestion(e.target.value)} 
                    fullWidth={true}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handleAddQuestion();
                        }
                    }} 
                />
            ) : (
                <Stack direction="row" spacing={2} sx={{ marginBottom: 2 }}>
                    <Button onClick={() => setShowInput(true)} variant="contained" color="primary">
                            Pridať otázku
                    </Button>
                </Stack>
            )} 
            <List>
                {questions.map((q, index) => (
                    <ListItem key={index}>
                    <Stack direction="row" justifyContent="space-between" width="100%">
                        <Stack direction="column" spacing={0} sx={{ padding: 0 }}>
                            <ListItemText primary={"Otázka č." + (index + 1)}/>
                            <ListItemText primary={q} />
                        </Stack>
                        <IconButton onClick={() => handleDeleteQuestion(index)}>
                            <DeleteIcon />
                        </IconButton>
                    </Stack>
                </ListItem>
                ))}
            </List>
            <Stack direction="row" justifyContent="right" width="100%">
                <Button onClick={handleSubmit} disabled={questions.length === 0} color="primary" variant="contained">Odoslať</Button>
                <Button onClick={() => nav(-1)}>Zrušiť</Button>
            </Stack>
            <Snackbar 
                open={notification} 
                onClose={handleCloseNotification} 
                message="Požiadavka spätnej väzby bola vytvorená." 
                autoHideDuration={6000} 
            />
        </Layout>
    );
};

export default NewFeedback;