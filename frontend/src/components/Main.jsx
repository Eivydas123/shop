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
import { Box, Paper } from "@material-ui/core";
import Category from "./Category";

const useStyles = makeStyles({
  media: {
    height: 200,
  },
});

export default function MediaCard() {
  const classes = useStyles();

  return (
    <Box mt={4}>
      <Container maxWidth="xl">
        <Grid container spacing={2} justify="center">
          <Grid item md={2}>
            <Grid container>
              <Grid item md={12}>
                <Category />
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={8}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Paper square elevation={0}>
                  <Typography variant="h5" color="initial">
                    The most popular
                  </Typography>
                </Paper>
              </Grid>
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
