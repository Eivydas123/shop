import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { Paper, TextField, Button, Grid } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";

import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import Box from "@material-ui/core/Box";
import Login from "./Login";
import Register from "./Register";
import { AnimatePresence, motion } from "framer-motion";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}
export default function DialogComp({ isOpen, handleOpen }) {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      <Dialog
        open={isOpen}
        onClose={handleOpen}
        aria-labelledby="form-dialog-title"
        fullWidth
      >
        <AppBar position="static" square>
          <Tabs
            variant="fullWidth"
            value={value}
            onChange={handleChange}
            aria-label="simple tabs example"
          >
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <Login handleOpen={handleOpen} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Register handleOpen={handleOpen} />
        </TabPanel>
      </Dialog>
    </>
  );
}
