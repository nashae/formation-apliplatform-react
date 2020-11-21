import React, { useContext, useState } from "react";
import ReactDOM from "react-dom";
import Navbar from "./js/components/Navbar";
import HomePage from "./js/pages/HomePage";
import {
    HashRouter,
    Switch,
    Route,
    withRouter,
    Redirect,
} from "react-router-dom";
import CustomersPage from "./js/pages/CustomerPage";
import CustomersPageWithPagination from "./js/pages/CustomerPage";
import InvoicesPage from "./js/pages/InvoicesPage";
import LoginPage from "./js/pages/LoginPage";
import AuthAPI from "./js/services/AuthAPI";
import AuthContext from "./js/contexts/AuthContext";
import PrivateRoute from "./js/components/PrivateRoute"

/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you import will output into a single css file (app.css in this case)
import "./styles/app.css";

AuthAPI.setup();


const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(
        AuthAPI.isAuthenticated
    );

    //on crée un composant navbarWithRouter pour pouvoir utiliser history dans navbar.jsx
    const NavbarWithRouter = withRouter(Navbar);

    const contextValue = {
        isAuthenticated: isAuthenticated,
        setIsAuthenticated: setIsAuthenticated,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            <HashRouter>
                <NavbarWithRouter />
                <main className="container pt-5">
                    <Switch>
                        <Route path="/login" component={LoginPage} />
                        <PrivateRoute
                            path="/customers"
                            component={CustomersPage}
                        />
                        <PrivateRoute
                            path="/invoices"
                            component={InvoicesPage}
                        />
                        <Route path="/" component={HomePage} />
                    </Switch>
                </main>
            </HashRouter>
        </AuthContext.Provider>
    );
};

const rootElement = document.querySelector("#app");
ReactDOM.render(<App />, rootElement);
