import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CardMedia from "@material-ui/core/CardMedia";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

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

const useStyles = makeStyles({
  kiekis: {
    maxWidth: 150,
  },
  media: {
    width: 40,
    height: 40,
    borderRadius: 2,
  },
});

export default function Cart() {
  const classes = useStyles();

  return (
    <>
      <Box mt={12}>
        <Container maxWidth="lg">
          <TableContainer component={Paper}>
            <Table aria-label="customized table">
              <TableHead>
                <TableRow hover={true}>
                  <StyledTableCell>PREKĖ</StyledTableCell>
                  <StyledTableCell align="center">
                    VIENETO KAINA
                  </StyledTableCell>
                  <StyledTableCell align="center">KIEKIS</StyledTableCell>
                  <StyledTableCell align="center">IŠ VISO</StyledTableCell>
                  <StyledTableCell align="center">IŠRTINTI</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.name}>
                    <StyledTableCell component="th" scope="row">
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
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.calories} $
                    </StyledTableCell>
                    <StyledTableCell align="center" className={classes.kiekis}>
                      <Grid container alignItems="center" justify="center">
                        <Grid item md={4}>
                          <IconButton
                            aria-label="delete"
                            size="small"
                            className={classes.margin}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Grid>
                        <Grid item md={4}>
                          <TextField
                            inputProps={{
                              min: 0,
                              style: { textAlign: "center" },
                            }}
                            value={5}
                            size="small"
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item md={4}>
                          <IconButton
                            aria-label="delete"
                            size="small"
                            className={classes.margin}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.carbs}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <IconButton
                        aria-label="delete"
                        size="small"
                        className={classes.margin}
                      >
                        <HighlightOffIcon />
                      </IconButton>
                    </StyledTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Box px={2} py={2}>
              <Grid container spacing={1} justify="space-between">
                <Grid item>
                  <Typography variant="h6" color="initial" align="right">
                    Is viso: 500$
                  </Typography>
                </Grid>
                <Grid item>
                  <Button variant="text" color="default">
                    Pirkti
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </TableContainer>
        </Container>
      </Box>
    </>
  );
}
