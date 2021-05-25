import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import DraftsIcon from "@material-ui/icons/Drafts";
import SendIcon from "@material-ui/icons/Send";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import StarBorder from "@material-ui/icons/StarBorder";
import ComputerIcon from "@material-ui/icons/Computer";
import BusinessIcon from "@material-ui/icons/Business";
import TvIcon from "@material-ui/icons/Tv";
import HomeIcon from "@material-ui/icons/Home";
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
import DevicesOtherIcon from "@material-ui/icons/DevicesOther";
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export default function NestedList() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(null);

  const catalog = [
    {
      name: "Kompiuteriai",
      icon: <ComputerIcon />,
    },
    {
      name: "Periferija",
      icon: <BusinessIcon />,
    },
    {
      name: "Namu elektronika",
      icon: <TvIcon />,
    },
    {
      name: "Žaidimų įranga",
      icon: <SportsEsportsIcon />,
    },
    {
      name: "Buitinė technika",
      icon: <HomeIcon />,
    },
    {
      name: "Kitos prekės",
      icon: <DevicesOtherIcon />,
    },
  ];
  const handleClick = (name) => {
    setOpen(name === open ? null : name);
  };

  return (
    <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Product catalog
        </ListSubheader>
      }
      className={classes.root}
    >
      {catalog.map((item, index) => {
        return (
          <div key={index}>
            <ListItem button onClick={() => handleClick(item.name)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.name} />
              {open === item.name ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open === item.name} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button className={classes.nested}>
                  <ListItemIcon>
                    <StarBorder />
                  </ListItemIcon>
                  <ListItemText primary="Starred" />
                </ListItem>
              </List>
            </Collapse>
          </div>
        );
      })}
    </List>
  );
}
