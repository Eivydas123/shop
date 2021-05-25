import React from "react";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import CardMedia from "@material-ui/core/CardMedia";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Divider, Button } from "@material-ui/core";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const useStyles = makeStyles({
  kiekis: {
    maxWidth: 150,
  },
  media: {
    width: "100%",
    height: 500,
    borderRadius: 2,
  },
});
export default function Details() {
  const classes = useStyles();
  return (
    <>
      <Box my={5}>
        <Container maxWidth="lg" component={Paper} elevation={0}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h5" color="textPrimary" gutterBottom>
                Lorem ipsum dolor sit amet consectetur adipisicing
              </Typography>
              <Carousel showStatus={false} showThumbs={false}>
                <div>
                  <CardMedia
                    className={classes.media}
                    image="https://source.unsplash.com/random"
                    title="Paella dish"
                  />
                </div>
                <div>
                  <CardMedia
                    className={classes.media}
                    image="https://source.unsplash.com/random"
                    title="Paella dish"
                  />
                </div>
                <div>
                  <CardMedia
                    className={classes.media}
                    image="https://source.unsplash.com/random"
                    title="Paella dish"
                  />
                </div>
              </Carousel>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={1} justify="space-between">
                <Grid item>
                  <Typography variant="body1" color="textSecondary">
                    Quantity: 5
                  </Typography>
                </Grid>
                <Grid item>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<AddShoppingCartIcon />}
                  >
                    Add to cart
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5" color="textSecondary">
                Description
              </Typography>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="initial">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam
                laudantium odio dolorum sunt esse necessitatibus recusandae
                placeat ea vero reprehenderit nemo ducimus dolor molestiae
                cumque maxime quidem alias itaque asperiores, voluptas, nam rem
                eum error? Cum exercitationem consequuntur illo officiis
                repellat illum debitis, vitae quae facere hic. Repellat,
                quibusdam vero.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
