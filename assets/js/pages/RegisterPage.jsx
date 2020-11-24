import Axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Field from "../components/forms/field";
import UsersAPI from "../services/UsersAPI";

const RegisterPage = ({history}) => {
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: "",
    });

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: "",
    });

    //gestion des changement des inputs dans le formulaire
    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setUser({ ...user, [name]: value });
    };

    //gestion de la soumission
    const handleSubmit = async (event) => {
        event.preventDefault();
        const apiErrors = {};
        if(user.password !== user.passwordConfirm){
            apiErrors.passwordConfirm = "Les mots de passe doivent etre identiques";
            setErrors(apiErrors);
            toast.error("Il y a des erreurs dans votre formulaire, corrigez-les pour valider votre inscription");
            return;
        }
        try {
            await UsersAPI.register(user);
            setErrors({});
            toast.success("Inscription effectuée, vous pouvez vous connecter 😎");
            history.replace('/login');
        } catch (error){
            console.log(error.response);
            const {violations} = error.response.data;
            if(violations){
                violations.forEach(violation => {
                    apiErrors[violation.propertyPath] = violation.message
                });
                setErrors(apiErrors);
            }
            toast.error("Il y a des erreurs dans votre formulaire, corrigez-les pour valider votre inscription");
        }
    };

    return (
        <>
            <h1>Page d'inscription</h1>
            <form onSubmit={handleSubmit}>
                <Field
                    name="firstName"
                    label="Prénom"
                    placeholder="Votre prénom"
                    error={errors.firstName}
                    value={user.firstName}
                    onChange={handleChange}
                />
                <Field
                    name="lastName"
                    label="Nom de famille"
                    placeholder="Votre nom de famille"
                    error={errors.lastName}
                    value={user.lastName}
                    onChange={handleChange}
                />
                <Field
                    name="email"
                    label="Adresse email"
                    placeholder="Votre adresse email"
                    type="email"
                    error={errors.email}
                    value={user.email}
                    onChange={handleChange}
                />
                <Field
                    name="password"
                    label="Mot de passe"
                    placeholder="Votre mot de passe"
                    error={errors.password}
                    type="password"
                    value={user.password}
                    onChange={handleChange}
                />
                <Field
                    name="passwordConfirm"
                    label="Confirmation du mot de passe"
                    placeholder="Confirmez votre mot de passe"
                    type="password"
                    error={errors.passwordConfirm}
                    value={user.passwordConfirm}
                    onChange={handleChange}
                />
                <div className="form-group">
                    <button type="submit" className="btn btn-success">
                        Confirmation
                    </button>
                    <Link to="/login" className="btn btn-link">
                        J'ai déjà un compte
                    </Link>
                </div>
            </form>
        </>
    );
};

export default RegisterPage;
