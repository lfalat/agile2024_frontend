import React, { useEffect } from "react";
import { useState } from "react";
import { OrganizationChart } from "primereact/organizationchart";
import OrgNode from "../types/OrgHierarchy/OrgNode";
import OrgTree from "../types/OrgHierarchy/OrgTree";
import api from "../app/api";
import { useAuth } from "../hooks/AuthProvider";
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    IconButton,
    Stack,
    styled,
    Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import Person4Icon from "@mui/icons-material/Person4";
import "primereact/resources/themes/lara-light-cyan/theme.css";
const OrganizationHierarchy: React.FC = () => {
    const { userProfile, setUserProfile, setRefresh, refresh } = useAuth();
    const [userId] = useState(userProfile?.id);
    const [hierarchy, setHierarchy] = useState<OrgTree | null>(null);
    const fetchData = async () => {
        try {
            const res = await api.get(`/OrgHierarchyShow/GetLevelByID?userId=${userId}`);
            console.log("API Response:", res.data); // Log the API response
            const fetchedData: OrgTree = res.data;
            setHierarchy(fetchedData);
            console.log(fetchedData); // Log the fetched data
        } catch (err) {
            console.error("API call failed:", err); // Log the error
        }
    };

    useEffect(() => {
        fetchData();
    }, [refresh, userId]);

    useEffect(() => {
        console.log("Hierarchy use state: ", hierarchy);
        console.log("Hierarchy use state: ", hierarchy?.orgTree);
        const show = hierarchy !== null;
        console.log(show);
    }, [hierarchy]);

    const nodeTemplate = (node: OrgNode) => {
        return (
            <Box
                sx={{
                    minWidth: 300,
                    textAlign: "center",
                    border: "2px solid #000",
                    borderRadius: 2,
                    overflow: "hidden",
                    boxShadow: 3,
                    bgcolor: "white", // Change background color based on userId
                    position: "relative",
                    paddingBottom: 1,
                    paddingTop: 1,
                }}
            >
                {/* Profile Image */}
                <Avatar
                    src={node.image}
                    alt="https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg"
                    sx={{
                        width: 80,
                        height: 80,
                        margin: "0 auto",
                        marginTop: "0 auto",
                        marginBottom: 2,
                        border: "3px solid white",
                        boxShadow: 2,
                    }}
                />

                {/* Name with Icon */}
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    gap={1}
                    sx={{
                        bgcolor: node.userId === userId ? "primary.main" : "cyan", // Change background color based on userId
                        paddingY: 1,
                        fontWeight: "bold",
                        borderBottom: "1px solid #ddd",
                    }}
                >
                    {node.userId === userProfile?.id ? (
                        <ThumbUpIcon fontSize="small" />
                    ) : node.isSuperior ? (
                        <Person4Icon fontSize="small" />
                    ) : null}
                    <Typography fontWeight="bold">{node.name}</Typography>
                </Box>

                {/* Job Title */}
                <Typography variant="body2" sx={{ paddingX: 1, paddingTop: 1 }}>
                    {node.position}
                </Typography>

                {/* Location */}
                <Typography
                    variant="body2"
                    fontStyle="italic"
                    color="gray"
                    sx={{ paddingX: 1, paddingBottom: 1 }}
                >
                    {node.location}
                </Typography>
            </Box>
        );
    };

    return (
        <div>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" marginBottom={9}>
                {/* Left-aligned Typography */}
                <Typography variant="h6" gutterBottom>
                    Názov oddelenia: {hierarchy?.name}({hierarchy?.code})
                </Typography>

                {/* Right-aligned Buttons */}
                <Box display="flex" alignItems="center" gap={1}>
                    {/* Show Level Button */}
                    <Button variant="contained" color="primary">
                        Zobraziť 1. úroveň
                    </Button>

                    {/* Search Icon Button */}
                    <IconButton color="primary">
                        <SearchIcon />
                    </IconButton>
                </Box>
            </Box>
            <div className="card">
                {hierarchy?.orgTree && (
                    <div>
                        <OrganizationChart value={hierarchy?.orgTree} nodeTemplate={nodeTemplate} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrganizationHierarchy;
