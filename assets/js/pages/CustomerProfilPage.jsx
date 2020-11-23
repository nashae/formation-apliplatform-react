import React, { useEffect, useState } from "react";
import Field from "../components/forms/field";
import { Link } from "react-router-dom";
import Axios from "axios";
import CustomersAPI from "../services/CustomersAPI";

const CustomerProfilPage = ({match, history}) => {

    const { id = "new" } = match.params;

    const [customer, setCustomer] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: "",
    });

    const [errors, setErrors] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: "",
    });

    const [editing, setEditing] = useState(false);

    //recuperation du customer en fonction de l'identifiant
    const fetchCustomer = async (id) => {
        try {
            const { firstName, lastName, email, company } = await CustomersAPI.find(id)
            setCustomer({ firstName, lastName, email, company });
        } catch (error) {
            console.log(error.response);
            history.replace("/customers");
        }
    };

    //chargement du customer si besoin au chargement du composant ou au changement de l'identifiant
    useEffect(() => {
        if (id !== "new") {
            setEditing(true);
            fetchCustomer(id);
        }
    }, [id]);

    //gestion des changements des input dans le formulation
    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setCustomer({ ...customer, [name]: value });
    };

    //gestion de la validation du formulaire
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (editing) {
                await CustomersAPI.update(id, customer);
            } else {
                await CustomersAPI.create(customer);
                history.replace("/customers");
            }
            setErrors({});
        } catch (error) {
            if (error.response.data.violations) {
                const apiErrors = {};
                error.response.data.violations.forEach((violation) => {
                    apiErrors[violation.propertyPath] = violation.message;
                });
                setErrors(apiErrors);
            }
        }
    };

    return (
        <>
            {(!editing && <h1>Creation d'un client</h1>) || (
                <h1>Modification du client</h1>
            )}
            <form onSubmit={handleSubmit}>
                <Field
                    name="lastName"
                    label="Nom de famille"
                    placeholder="Nom de famille du client"
                    value={customer.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                />
                <Field
                    name="firstName"
                    label="Prénom"
                    placeholder="Prénom du client"
                    value={customer.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                />
                <Field
                    name="email"
                    label="Email"
                    placeholder="Email du client"
                    type="email"
                    value={customer.email}
                    onChange={handleChange}
                    error={errors.email}
                />
                <Field
                    name="company"
                    label="Entreprise"
                    placeholder="Entreprise du client (champ optionnel)"
                    value={customer.company}
                    onChange={handleChange}
                    error={errors.company}
                />
                <div className="form-group">
                    <button type="submit" className="btn btn-success">
                        Enregistrer
                    </button>
                    <Link to="/customers" className="btn btn-link">
                        Retour à la liste
                    </Link>
                </div>
            </form>
        </>
    );
};

export default CustomerProfilPage;
