import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import {
  Paper,
  TextField,
  Button,
  Grid,
  Box,
  CircularProgress,
} from "@material-ui/core";
import { Form, Formik, Field } from "formik";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext";

export default function Register({ handleOpen }) {
  const { signUp } = useAuth();
  const [error, setError] = useState("");

  const validationShema = Yup.object().shape({
    password: Yup.string()
      .min(6, "Too Short!")
      .max(50, "Too Long!")
      .required("Required"),
    password_confimation: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
  });
  const onSubmit = async (values) => {
    try {
      setError("");
      await signUp(values.email, values.password);
      handleOpen();
    } catch (e) {
      console.log(e.message);
      setError(e.message);
    }
  };
  const initialValues = {
    email: "",
    password: "",
    password_confimation: "",
  };
  return (
    <>
      <Typography variant="h4" color="inherit" component="div">
        Register
      </Typography>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationShema}
      >
        {(formik) => {
          return (
            <Form>
              <Field
                error={formik.errors.email && formik.touched.email}
                helperText={formik.touched.email && formik.errors.email}
                as={TextField}
                name="email"
                margin="normal"
                label="Email Address"
                type="email"
                fullWidth
              />

              <Field
                error={formik.errors.password && formik.touched.password}
                helperText={formik.touched.password && formik.errors.password}
                as={TextField}
                name="password"
                margin="normal"
                label="Password"
                type="password"
                fullWidth
              />

              <Field
                error={
                  formik.errors.password_confimation &&
                  formik.touched.password_confimation
                }
                helperText={
                  formik.touched.password_confimation &&
                  formik.errors.password_confimation
                }
                as={TextField}
                name="password_confimation"
                margin="normal"
                label="Confirm password"
                type="password"
                fullWidth
              />
              <Typography variant="body2" color="error">
                {error}
              </Typography>

              <Box
                mt={2}
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
              >
                <Button
                  onClose={handleOpen}
                  variant="contained"
                  color="primary"
                  size="large"
                  type="submit"
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting ? (
                    <CircularProgress color="secondary" size="20px" />
                  ) : (
                    <span>Register</span>
                  )}
                </Button>
              </Box>
            </Form>
          );
        }}
      </Formik>
    </>
  );
}
