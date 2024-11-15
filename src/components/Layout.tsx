import { AppBar, Avatar, Box, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Toolbar, Tooltip, Typography } from "@mui/material";
import { ReactNode, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../hooks/AuthProvider";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import HttpsIcon from "@mui/icons-material/Https";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import Roles from "../types/Roles";

const drawerWidth = 240;

interface LayoutProps {
    children?: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const { userProfile } = useAuth();
    const nav = useNavigate();

    const toggleDrawer = () => {
        if (!isClosing) {
            setMobileOpen((prev) => !prev);
        }
    };

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/login";
    };

    const menuItems = [
        {
            role: Roles.Spravca,
            label: "Správa používateľov",
            path: "/manageUsers",
        },
        {
            role: Roles.Spravca,
            label: "Správa orginazácie",
            path: "/manageOrganizations",
        },
        {
            role: Roles.Spravca,
            label: "Správa oddelení",
            path: "/manageDivisions",
        },
        {
            role: Roles.Spravca,
            label: "Správa lokalít",
            path: "/manageLocations",
        },
        {
            role: Roles.Spravca,
            label: "Správa pracovných pozícií",
            path: "/manageWorkPositions",
        },
        // {
        //     label: "Ciele a rozvoj môjho tímu",
        //     path: "/cieleRozvojTimu",
        // },
        // {
        //     label: "Moje ciele a rozvoj",
        //     path: "/cieleRozvojMoje",
        // },
    ];

    return (
        <Box sx={{ display: "flex" }}>
            <AppBar
                position="fixed"
                sx={{
                    backgroundColor: "#FFD6B8",
                    color: "black",
                }}
            >
                <Toolbar sx={{ display: "flex" }}>
                    <IconButton color="inherit" edge="start" onClick={toggleDrawer} sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                    <img
                        src="logoSiemensFull.png"
                        onClick={() => {
                            nav("/home");
                        }}
                        width="160px"
                        style={{ cursor: "pointer" }}
                    />
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar src={userProfile?.profilePicLink || "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg"} sx={{ backgroundColor: "black" }} />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                            keepMounted
                            transformOrigin={{ vertical: "top", horizontal: "left" }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                            slotProps={{
                                paper: {
                                    style: {
                                        backgroundColor: "#FFD6B8",
                                        color: "black",
                                    },
                                },
                            }}
                        >
                            <MenuList>
                                <ListItemText>{userProfile?.role}</ListItemText>
                                <ListItemText>
                                    {userProfile?.titleBefore} {userProfile?.firstName} {userProfile?.lastName} {userProfile?.titleAfter}
                                </ListItemText>

                                <MenuItem onClick={() => nav("/profile")}>
                                    <ListItemIcon>
                                        <PersonIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>Profil</ListItemText>
                                </MenuItem>
                                <MenuItem onClick={() => nav("/settings")}>
                                    <ListItemIcon>
                                        <SettingsIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>Nastavenia</ListItemText>
                                </MenuItem>
                                <MenuItem onClick={() => nav("/passwordChange")}>
                                    <ListItemIcon>
                                        <HttpsIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>Zmena hesla</ListItemText>
                                </MenuItem>
                                <MenuItem onClick={handleLogout}>
                                    <ListItemIcon>
                                        <LogoutIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>Odhlásiť</ListItemText>
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerClose}
                onTransitionEnd={handleDrawerTransitionEnd}
                ModalProps={{ keepMounted: true }}
                PaperProps={{
                    sx: {
                        backgroundColor: "#FFD6B8",
                    },
                }}
                sx={{
                    "& .MuiDrawer-paper": {
                        boxSizing: "border-box",
                        width: drawerWidth,
                    },
                }}
            >
                <Toolbar />
                <List>
                    {menuItems.map(
                        (item) =>
                            (item.role ? userProfile?.role === item.role : true) && (
                                <ListItem key={item.label} disablePadding onClick={() => nav(item.path)}>
                                    <ListItemButton>
                                        <ListItemText primary={item.label} />
                                    </ListItemButton>
                                </ListItem>
                            )
                    )}
                </List>
            </Drawer>

            <Box
                component="main"
                sx={{
                    maxWidth: "80%",
                    flexGrow: 1,
                    p: 3,
                }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
};

export default Layout;
