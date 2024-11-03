import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Box, Button, Typography } from "@mui/material";
import { DataGridPro, GridColDef } from "@mui/x-data-grid-pro";
import UserProfile from "../../types/UserProfile";
import api from "../../app/api";
import { useNavigate } from "react-router-dom";

const ManageUsers: React.FC = () => {
    const [userRows, setUserRows] = useState<UserProfile[]>([]);
    const nav = useNavigate();

    useEffect(() => {
        api.get("/User/Users")
            .then((res) => {
                const rows: UserProfile[] = res.data;
                setUserRows(rows);
            })
            .catch((err) => {
                setUserRows([]);
                console.error(err);
            });
    }, []);

    const columns: GridColDef<(typeof userRows)[number]>[] = [
        {
            field: "email",
            headerName: "Používateľské meno",
            width: 200,
            resizable: false,
        },
        {
            field: "firstName",
            headerName: "Meno",
            width: 150,
            resizable: false,
        },
        {
            field: "lastName",
            headerName: "Priezvisko",
            width: 150,
            resizable: false,
        },
        {
            field: "titleBefore",
            headerName: "Tituly pred menom",
            width: 150,
            resizable: false,
        },
        {
            field: "titleAfter",
            headerName: "Tituly za menom",
            width: 150,
            resizable: false,
        },
        {
            field: "role",
            headerName: "Rola používateľa",
            width: 150,
            resizable: false,
        },
        {
            field: "actions",
            headerName: "Akcie",
            width: 200,
            resizable: false,
        }
    ];

    const handleEdit = (user: UserProfile) => {
        // Handle user edit logic here
        console.log("Edit user:", user);
    };

    return (
        <Layout>
            <Box sx={{ padding: 3, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <Typography variant="h4" fontWeight='bold' gutterBottom>
                    Správa používateľov
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginBottom: 2 }}
                    onClick={() => {
                        nav("/registerUser");
                    }}
                >
                    Pridať nového používateľa
                </Button>
                <Box sx={{ width: "100%" }}>
                    <DataGridPro
                        columns={columns}
                        rows={userRows}
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

export default ManageUsers;
