import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { Box, Divider, Paper } from "@material-ui/core";
import Slider from "@material-ui/core/Slider";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

const useStyles = makeStyles({
  media: {
    height: 200,
  },
});

export default function Search() {
  const classes = useStyles();
  const [value, setValue] = React.useState([20, 37]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box mt={5}>
      <Container maxWidth="xl">
        <Grid container spacing={2} justify="center">
          <Grid item md={2}>
            <Grid container>
              <Grid item md={12}>
                <Paper>
                  <Box p={3}>
                    <Typography gutterBottom variant="h6">
                      Price range
                    </Typography>
                    <Slider
                      value={value}
                      onChange={handleChange}
                      valueLabelDisplay="auto"
                      aria-labelledby="range-slider"
                      // getAriaValueText={valuetext}
                    />
                    <Typography gutterBottom variant="h6">
                      Manufactor
                    </Typography>
                    <Grid container spacing={1}>
                      {[0, 1, 2, 3, 4, 5, 6].map((item, index) => {
                        return (
                          <Grid item key={index} xs={12}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  name="checkedB"
                                  color="primary"
                                  size="small"
                                />
                              }
                              label="Primary"
                            />
                          </Grid>
                        );
                      })}
                    </Grid>
                    <Divider />
                    <Typography gutterBottom variant="h6">
                      Color
                    </Typography>
                    <Grid container spacing={1}>
                      {[0, 1, 2, 3, 4, 5, 6].map((item, index) => {
                        return (
                          <Grid item key={index} xs={12}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  name="checkedB"
                                  color="primary"
                                  size="small"
                                />
                              }
                              label="red"
                            />
                          </Grid>
                        );
                      })}
                    </Grid>
                    <Divider />
                    <Typography id="range-slider" gutterBottom variant="h6">
                      Category
                    </Typography>
                    <Grid container spacing={1}>
                      {[0, 1, 2, 3, 4, 5, 6].map((item, index) => {
                        return (
                          <Grid item key={index} xs={12}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  name="checkedB"
                                  color="primary"
                                  size="small"
                                />
                              }
                              label="red"
                            />
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                </Paper>

                {/* <Category /> */}
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={8}>
            <Grid container spacing={1}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => {
                return (
                  <Grid item md={3} key={index}>
                    <Card className={classes.root} elevation={0}>
                      <CardActionArea disableTouchRipple disableRipple>
                        <CardMedia
                          className={classes.media}
                          image="https://source.unsplash.com/random"
                          title="Contemplative Reptile"
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="h2">
                            Lizard
                          </Typography>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            component="p"
                          >
                            Lizards are a widespread group of squamate reptiles,
                            with over 6,000 species, ranging across all
                            continents except Antarctica
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Box ml="auto">
                            <Button size="small" color="primary">
                              Learn More
                            </Button>
                          </Box>
                        </CardActions>
                      </CardActionArea>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
