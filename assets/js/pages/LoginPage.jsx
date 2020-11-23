import React, { useContext, useState } from "react";
import Field from "../components/forms/field";
import AuthContext from "../contexts/AuthContext";
import AuthAPI from "../services/AuthAPI";

const LoginPage = ({ onLogin, history }) => {
    const { setIsAuthenticated } = useContext(AuthContext);
    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
    });

    const [error, setError] = useState("");

    //gestion des champs
    const handleChange = ({ currentTarget }) => {
        const value = currentTarget.value;
        const name = currentTarget.name;
        setCredentials({ ...credentials, [name]: value });
    };

    //gestion du submit
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await AuthAPI.authenticate(credentials);
            setError("");
            setIsAuthenticated(true);
            history.replace("/customers");
        } catch (error) {
            console.log(error.response);
            setError(
                "aucun compte ne possede ce mail ou les informations ne correspondent pas"
            );
        }
    };

    return (
        <>
            <h1>Connexion à l'application</h1>
            <form onSubmit={handleSubmit}>
                <Field
                    label="Adresse email"
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                    placeholder="Adresse email de connexion"
                    error={error}
                />
                <Field
                    label="Mot de passe"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    type="password"
                />

                <div className="form-group">
                    <button type="submit" className="btn-success">
                        Je me connecte
                    </button>
                </div>
            </form>
        </>
    );
};

export default LoginPage;
