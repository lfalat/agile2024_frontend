import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Grid,
  Paper,
  InputLabel,
  FormControl,
  Select,
  Link,

} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Layout from "../../../components/Layout";
import dayjs from "dayjs";
import AddEmployeeModal from "./AddEmployees";
import { EmployeeCard } from "../../../types/EmployeeCard";
import api from "../../../app/api";
import { CourseResponse, FilePath } from "../../../types/responses/CourseRespones";
import { useAuth } from "../../../hooks/AuthProvider";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const CreateCourse: React.FC = () => {
    const { userProfile } = useAuth();
  const [courseType, setCourseType] = useState("Kurz");
  const [files, setFiles] = useState<File[]>([]);
  const [employeeOptions, setEmployeeOptions] = useState<EmployeeCard[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<EmployeeCard[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [expirationDate, setExpirationDate] = useState<dayjs.Dayjs | null>(null);
    const [courseVersion, setCourseVersion] = useState<number>(1);
    const [courseNote, setCourseNote] = useState('');
    useEffect(() => {
    api.get(`/employeeCard/GetCurrentSuperiorDepartmentTeam`)    
        .then((res) => {
            setEmployeeOptions(res.data); 
            console.log(res.data);
        })
    }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const uniqueFiles = [...files, ...newFiles.filter(f => !files.some(existing => existing.name === f.name))];
      setFiles(uniqueFiles);
      console.log("Selected files:", files);
    }
  };
  const handleSave = (selected: string[]) => {
    const selectedEmps = employeeOptions.filter(emp => selected.includes(emp.employeeId));
    setSelectedEmployees(selectedEmps);  // Presunieme vybraných zamestnancov do state
  };
  const handleDocUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post("/Course/UploadFile", formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).catch((error) => {
        console.error('Error uploading file:', error);
        return null;
    });

    if (!res || !res.data) {
        throw new Error('Failed to upload file');
    }

    return res.data.filePath; 
};
  const handleSubmit = async () => {
    const filePath: FilePath[] = [];
    console.log("Files:", files);
    await files.forEach((file) => async () => {
        try {
        const uploadedFilePath = await handleDocUpload(file);
        console.log("uploadedFilePath", uploadedFilePath);
        filePath.push({
            Description: file.name,
            FilePath: uploadedFilePath, // Adjust this as per your API requirements
        });
        } catch (error) {
            console.error('Failed to save course:', error);
        }
    });
    console.log(filePath);
    const employeeIds = selectedEmployees.map(emp => emp.employeeId);
    const newCourse: CourseResponse = {
        DetailDescription: courseNote,
        CreatedUserId: userProfile?.id || '', // Replace with the actual user ID
        Employees: employeeIds, // Assuming employeeId is the correct field
        Type: courseType, // Add the missing Type property
        Files: filePath, // Adjust as per your API
        Version: courseVersion,
        Name: courseName,
        ExpirationDate: expirationDate || dayjs(), // Ensure ExpirationDate is never null
    };
    console.log(newCourse);
    try {
      const response: { data: any } = await api.post('/Courses/CreateCourse', newCourse);
      console.log('Course saved successfully', response.data);
      // Optionally reset form or navigate away
    } catch (error) {
      console.error('Failed to save course:', error);
    }
  };

    function nav(arg0: string): void {
        throw new Error("Function not implemented.");
    }

  return (
    <Layout>
      <Box sx={{ padding: 4 }}>
        <Typography variant="h6" gutterBottom>
          Pridať kurz / školenie
        </Typography>

        <div>
      <Button variant="contained" onClick={() => setOpenDialog(true)}>
        Pridať zamestnanca
      </Button>
      {openDialog && (
      <AddEmployeeModal
            employees={employeeOptions}
            selectedEmployees={selectedEmployees.map(emp => emp.employeeId)}
            onClose={() => setOpenDialog(false)}
            onSave={handleSave}
                           />
                        )}
      <Typography variant="h6" gutterBottom>
        Vybraní zamestnanci:
      </Typography>
      {selectedEmployees.map((emp) => (
        <Typography key={emp.id}>{emp.name}</Typography>
      ))}
    </div>

        <Grid container spacing={4}>
          {/* Left Column */}
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Názov" sx={{ mb: 2 }} onChange={(e) => setCourseName(e.target.value)} />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Typ</InputLabel>
              <Select
                value={courseType}
                label="Typ"
                onChange={(e) => setCourseType(e.target.value)}
              >
                <MenuItem value="Kurz">Kurz</MenuItem>
                <MenuItem value="Školenie">Školenie</MenuItem>
              </Select>
            </FormControl>
            <TextField fullWidth label="Verzia" sx={{ mb: 2 }} onChange={(e) => setCourseVersion(Number(e.target.value))} type="number"/>
            <Box
              sx={{
                border: "1px dashed #ccc",
                borderRadius: "4px",
                padding: 2,
                textAlign: "center",
                mb: 3,
              }}
            >
              <Button
                component="label"
                startIcon={<CloudUploadIcon />}
              >
                Priložiť súbor
                <input
                  hidden
                  type="file"
                  accept=".pdf,.doc,.docx,.pptx,.xlsx,.txt"
                  multiple
                  onChange={handleFileChange}
                />
              </Button>
            </Box>

            {/* File List */}
            {files.map((file) => (
              <Typography key={file.name}>
                <Link href="#" download>
                  {file.name}
                </Link>
              </Typography>
            ))}
             <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Termín dokončenia"
                                        value={expirationDate}
                                        onChange={(newValue) => setExpirationDate(newValue)}
                                    />
                                            
            </LocalizationProvider>
          </Grid>

          {/* Right Column - Note */}
          <Grid item xs={12} md={6} >
            <TextField
              fullWidth
              label="Poznámka"
              value={courseNote}
              onChange={(e) => setCourseNote(e.target.value)}
              multiline
              rows={10}
              sx={{ height: "100%", padding: 1 }}
            />
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4, gap: 2 }}>
          <Button variant="contained" color="primary" onClick={() => handleSubmit()}>
            Uložiť
          </Button>
          <Button variant="contained" color="inherit" onClick={() => nav('/manageCourses')}>
            Zrušiť
          </Button>
        </Box>
      </Box>

      
    </Layout>
  );
};

export default CreateCourse;
