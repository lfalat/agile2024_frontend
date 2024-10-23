import * as React from "react";
import { styled } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ChevronUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ChevronDownIcon from "@mui/icons-material/KeyboardArrowDown";

import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import LockIcon from "@mui/icons-material/Lock";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";

interface HeaderProps {
  drawerIsOpen: boolean;
  handleDrawerOpen: () => void;
  drawerWidth: number;
}

interface AppBarProps extends MuiAppBarProps {
  drawerIsOpen?: boolean;
}

const settings = [
  { label: "Profil", url: "/profile", icon: <PersonIcon /> },
  { label: "Nastavenia", url: "/settings", icon: <SettingsIcon /> },
  { label: "Zmena hesla", url: "/change-password", icon: <LockIcon /> },
  { label: "Odhlásiť sa", url: "/logout", icon: <LogoutIcon /> },
];

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, drawerIsOpen }) => ({
  backgroundColor: "#FFBD8C",
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(drawerIsOpen && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Header: React.FC<HeaderProps> = ({ drawerIsOpen, handleDrawerOpen }) => {
  const [userOptionsAreOpen, setUserOptionsAreOpen] =
    React.useState<null | HTMLElement>(null);
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setUserOptionsAreOpen(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setUserOptionsAreOpen(null);
  };

  const handleHomeButtonClick = () => {
    window.location.href = "/"; // Replace with your target URL
  };

  return (
    <AppBar position="fixed" drawerIsOpen={drawerIsOpen}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={[{ mr: 2, color: "black" }, drawerIsOpen && { display: "none" }]}
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Button onClick={handleHomeButtonClick}>
            <img
              src="https://www.fio.cz/docs/web_pics/Siemens_Healthineers_logo.png"
              alt="Button Image"
              style={{
                marginRight: "8px",
                width: "auto",
                height: "30px",
              }}
            />
            <HomeIcon sx={{ marginLeft: "8px", color: "black" }} />
          </Button>{" "}
        </Box>
        <Box sx={{ flexGrow: 0, marginRight: "40px" }}>
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar alt="User Avatar" src="" />
            {Boolean(userOptionsAreOpen) ? (
              <ChevronUpIcon />
            ) : (
              <ChevronDownIcon />
            )}
          </IconButton>
          <Menu
            anchorEl={userOptionsAreOpen}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(userOptionsAreOpen)}
            onClose={handleCloseUserMenu}
            PaperProps={{
              sx: {
                backgroundColor: "#FFBD8C",
                padding: "10px",
                width: "250px",
                boxShadow: "none",
                borderBottomLeftRadius: "12px",
                borderBottomRightRadius: "12px",
                borderTopLeftRadius: "0px",
                borderTopRightRadius: "0px",
              },
            }}
          >
            <Box sx={{ textAlign: "center", mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Správca systému
              </Typography>
              <Typography variant="body2">Ing. Jozef Mrkvička, PhD.</Typography>
            </Box>
            <Divider sx={{ mb: 1 }} />
            {settings.map((setting) => (
              <MenuItem
                key={setting.label}
                onClick={() => {
                  handleCloseUserMenu();
                  window.location.href = setting.url;
                }}
              >
                <ListItemIcon>{setting.icon}</ListItemIcon>
                <ListItemText primary={setting.label} />
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
