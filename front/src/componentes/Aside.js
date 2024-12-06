import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Link } from "react-router-dom";
import menuLinks from "../jsondata/rotas.json";
import "../componentes/Aside.css"

function Aside() {
  return (
    <div className="scrollable">
      <nav>
      <List>
          {menuLinks.map(link => (
            <ListItem key={link.path} disablePadding>
              <ListItemButton component={Link} to={link.path}>
                <ListItemText primary={link.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </nav>
    </div>
  );
}

export default Aside;