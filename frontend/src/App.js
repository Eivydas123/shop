import { Box, CssBaseline, Typography } from "@material-ui/core";
import Header from "./components/Header";
import Main from "./components/Main";

import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";
import purple from "@material-ui/core/colors/purple";
import green from "@material-ui/core/colors/green";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Cart from "./pages/Cart";
import Details from "./pages/Details";
import Search from "./pages/Search";
import firebase from "./utils/firebase";
import { createContext, useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "@material-ui/styles";
import "fontsource-roboto";
import PrivateRoute from "./components/PrivateRoute";
import AddProduct from "./pages/AddProduct";
import History from "./pages/History";

let theme = createMuiTheme({
  // palette: {
  //   primary: {
  //     main: purple[500],
  //   },
  //   secondary: {
  //     main: green[500],
  //   },
  // },
});
theme = responsiveFontSizes(theme);

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <Router>
          <Header />
          <Switch>
            <Route exact path="/" component={Main} />
            <PrivateRoute path="/cart" component={Cart} />
            <Route path="/search" component={Search} />
            <PrivateRoute path="/addproduct" component={AddProduct} />
            <PrivateRoute path="/history" component={History} />
            <Route path="/:id" component={Details} />
          </Switch>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
