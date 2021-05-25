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
import { useAuth } from "../context/AuthContext";
import * as Yup from "yup";

export default function Login({ handleOpen }) {
  const { login } = useAuth();
  const [error, setError] = useState("");

  const validationShema = Yup.object().shape({
    password: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
  });
  const onSubmit = async (values) => {
    try {
      setError("");
      await login(values.email, values.password);
      handleOpen();
    } catch (e) {
      setError(e.message);
    }
  };
  const initialValues = {
    email: "",
    password: "",
  };
  return (
    <>
      <Typography variant="h4" color="inherit" component="div">
        Login
      </Typography>
      {/* {JSON.stringify(currentUser)} */}
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
                  variant="contained"
                  color="primary"
                  size="large"
                  type="submit"
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
