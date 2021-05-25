import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { Paper, Box } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import TextField from "@material-ui/core/TextField";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

import HighlightOffIcon from "@material-ui/icons/HighlightOff";

import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: 8,
  },
  media: {
    width: 40,
    height: 40,
    borderRadius: 2,
  },
}));
function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}
export default function MediaControlCard() {
  const classes = useStyles();

  const rows = [
    createData(
      "Prekė su pažeista pakuote. Asus VivoBook R564JA-UH31TDX TouchScreen/4GB RAM/SSD 128GB",
      159,
      6.0,
      24,
      4.0
    ),
    createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
    createData("Eclair", 262, 16.0, 24, 6.0),
    createData("Cupcake", 305, 3.7, 67, 4.3),
    createData("Gingerbread", 356, 16.0, 49, 3.9),
  ];

  return (
    <Box mt={5}>
      <Container maxWidth="lg">
        <TableContainer component={Paper}>
          <Table aria-label="customized table">
            <TableHead>
              <TableRow hover={true}>
                <TableCell>PREKĖ</TableCell>

                <TableCell align="center">Suma</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    <Grid container spacing={1} alignItems="center">
                      <Grid item>
                        <CardMedia
                          className={classes.media}
                          image="https://source.unsplash.com/random"
                          title="Paella dish"
                        />
                      </Grid>
                      <Grid item> {row.name}</Grid>
                    </Grid>
                  </TableCell>

                  <TableCell align="center">$ 455</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
}
