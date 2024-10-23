import * as React from "react";
import { Link } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupIcon from "@mui/icons-material/Group";
import WorkIcon from "@mui/icons-material/Work";
import BusinessIcon from "@mui/icons-material/Business";
import ApartmentIcon from "@mui/icons-material/Apartment";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const menuOptions = [
  {
    label: "Vytvoriť nového používateľa",
    url: "/new-user",
    icon: <PersonAddIcon />,
  },
  { label: "Správa používateľov", url: "/manage-users", icon: <GroupIcon /> },
  {
    label: "Správa pracovných pozícií",
    url: "/manage-positions",
    icon: <WorkIcon />,
  },
  {
    label: "Správa organizácie",
    url: "/manage-organization",
    icon: <BusinessIcon />,
  },
  {
    label: "Správa oddelení",
    url: "/manage-departments",
    icon: <ApartmentIcon />,
  },
  {
    label: "Správa lokalít",
    url: "/manage-locations",
    icon: <LocationOnIcon />,
  },
];

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

interface SidebarProps {
  drawerIsOpen: boolean;
  onClose: () => void;
  drawerWidth: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  drawerIsOpen,
  onClose,
  drawerWidth,
}) => {
  const theme = useTheme();

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
      variant="persistent"
      anchor="left"
      open={drawerIsOpen}
    >
      <DrawerHeader>
        <IconButton onClick={onClose}>
          {theme.direction === "ltr" ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <List>
        {menuOptions.map((menu, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton component={Link} to={menu.url}>
              <ListItemIcon>{menu.icon}</ListItemIcon>
              <ListItemText primary={menu.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
