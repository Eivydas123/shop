import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";

import Grid from "@material-ui/core/Grid";

import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import Autocomplete from "@material-ui/lab/Autocomplete";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CircularProgress from "@material-ui/core/CircularProgress";
import { firestore } from "../utils/firebase";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function AddProduct() {
  const classes = useStyles();
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const loading = open && options.length === 0;

  const validationShema = Yup.object().shape({
    title: Yup.string().required("Required"),
    quantity: Yup.number("Ouantity must be a number")
      .min(0)
      .required("Required"),
    description: Yup.string().required("Required"),
    catalog: Yup.string().required("Required"),
    category: Yup.string().required("Required"),
    price: Yup.number().required("Required"),
  });
  const onSubmit = async (values) => {
    console.log("submit", values);
    try {
      setError("");
      await firestore.collection("products").add(values);

      console.log("success");
    } catch (e) {
      setError(e.message);
    }
  };
  const initialValues = {
    title: "",
    quantity: "",
    description: "",
    catalog: "",
    category: "Something",
    price: "",
  };

  const catalog = [
    "Kompiuteriai",
    "Periferija",
    "Namu elektronika",
    "Žaidimų įranga",
    "Buitinė technika",
    "Kitos prekės",
  ];

  useEffect(() => {
    const getProducts = async () => {
      firestore.collection("products").onSnapshot((snapshot) => {
        const postData = [];
        snapshot.forEach((doc) => postData.push({ ...doc.data(), id: doc.id }));
        console.log(postData);
      });
      // console.log(results.data());
    };
    getProducts();
  }, []);

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <AddCircleIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Add product
        </Typography>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationShema}
        >
          {(formik) => {
            // console.log(formik.values);
            return (
              <Form className={classes.form} noValidate>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Field
                      error={formik.errors.title && formik.touched.title}
                      helperText={formik.touched.title && formik.errors.title}
                      as={TextField}
                      name="title"
                      variant="outlined"
                      required
                      fullWidth
                      id="title"
                      label="Title"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      error={formik.errors.quantity && formik.touched.quantity}
                      helperText={
                        formik.touched.quantity && formik.errors.quantity
                      }
                      type="number"
                      as={TextField}
                      variant="outlined"
                      required
                      fullWidth
                      id="Quantity"
                      label="Quantity"
                      name="quantity"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      error={formik.errors.price && formik.touched.price}
                      helperText={formik.touched.price && formik.errors.price}
                      type="number"
                      as={TextField}
                      variant="outlined"
                      required
                      fullWidth
                      id="price"
                      label="Price"
                      name="price"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      error={
                        formik.errors.description && formik.touched.description
                      }
                      helperText={
                        formik.touched.description && formik.errors.description
                      }
                      as={TextField}
                      fullWidth
                      variant="outlined"
                      required
                      id="description"
                      label="Description"
                      name="description"
                      multiline
                      rows={5}
                      rowsMax={22}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Autocomplete
                      id="combo-box-demo"
                      autoComplete
                      autoSelect
                      options={catalog}
                      onChange={(s, value) =>
                        formik.setFieldValue("catalog", value || "")
                      }
                      getOptionLabel={(option) => option}
                      renderInput={(params) => (
                        <Field
                          {...params}
                          error={
                            formik.errors.catalog && formik.touched.catalog
                          }
                          helperText={
                            formik.touched.catalog && formik.errors.catalog
                          }
                          as={TextField}
                          label="Catalog"
                          variant="outlined"
                          name="catalog"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Autocomplete
                      id="asynchronous-demo"
                      open={open}
                      onOpen={() => {
                        setOpen(true);
                      }}
                      onClose={() => {
                        setOpen(false);
                      }}
                      getOptionSelected={(option, value) =>
                        option.name === value.name
                      }
                      disabled={!formik.values.catalog}
                      getOptionLabel={(option) => option.name}
                      options={options}
                      onChange={(s, value) =>
                        formik.setFieldValue("category", value || "")
                      }
                      // loading={loading}
                      renderInput={(params) => (
                        <Field
                          {...params}
                          name="category"
                          label="Category"
                          variant="outlined"
                          error={
                            formik.errors.category && formik.touched.category
                          }
                          helperText={
                            formik.touched.category && formik.errors.category
                          }
                          as={TextField}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {loading ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                <Typography variant="body2" color="error">
                  {error}
                </Typography>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Add product
                </Button>
              </Form>
            );
          }}
        </Formik>
      </div>
    </Container>
  );
}
