import { Box, Button, Typography } from "@mui/material";
import Layout from "../../../components/Layout";
import { useNavigate} from "react-router-dom";
import React, { useEffect, useState } from "react";
import { DataGridPro, GridColDef } from "@mui/x-data-grid-pro";
import api from "../../../app/api";
import { Department } from "../../../types/Department";

const ManageDivisions: React.FC = () => {
    const [departmentRows, setDepartmentRows] = useState<Department[]>([]);
    const nav = useNavigate();

    useEffect(() => {
        api.get("/Department/Departments")
            .then((res) => {
                const rows: Department[] = res.data;
                console.log("Response: ", res.data);
                setDepartmentRows(rows);
            })
            .catch((err) => {
                setDepartmentRows([]);
                console.error(err);
            });
    }, []);

    const columns: GridColDef<(typeof departmentRows)[number]>[] = [
        {
            field: "name",
            headerName: "Názov oddelenia",
            width: 200,
            resizable: false,
        },
        {
            field: "code",
            headerName: "Kód oddelenia",
            width: 250,
            resizable: false,
        },
        {
            field: "organizationName",
            headerName: "Príslušná organizácia",
            width: 250,
            resizable: false,
        },
        {
            field: "created",
            headerName: "Dátum vytvorenia oddelenia",
            width: 250,
            resizable: false,
        },
        {
            field: "actions",
            headerName: "Akcie",
            width: 200,
            resizable: false,
        }
    ];

    return (
        <Layout>
            <Box sx={{ padding: 3, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Správa oddelení
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginBottom: 2 }}
                    onClick={() => {
                        nav("/newDivision");
                    }}
                >
                    Pridať nové oddelenie
                </Button>

                <Box sx={{ width: "100%" }}>
                    <DataGridPro
                        columns={columns}
                        rows={departmentRows}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 10,
                                },
                            },
                            pinnedColumns: {
                                right: ["actions"],
                            },
                        }}
                        pageSizeOptions={[5, 10, 25]}
                        pagination
                    />
                </Box>
            </Box>
        </Layout>
    );
};

export default ManageDivisions;
