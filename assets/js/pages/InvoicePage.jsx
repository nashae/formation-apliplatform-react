import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Field from "../components/forms/field";
import Select from "../components/forms/Select";
import FormContentLoader from "../components/loaders/FormContentLoader";
import CustomersAPI from "../services/CustomersAPI";
import InvoicesAPI from "../services/InvoicesAPI";

const InvoicePage = ({ history, match}) => {

    const {id = "new"} = match.params;

    const [invoice, setInvoice] = useState({
        amount: "",
        customer: "",
        status: "SENT",
    });

    const [customers, setCustomers] = useState([]);

    const [editing, setEditing] = useState(false);

    const [errors, setErrors] = useState({
        amount: "",
        customer: "",
        status: "",
    });

    const [loading, setLoading] = useState(true)

    //recuperation des clients
    const fetchCustomers = async () => {
        try {
            const data = await CustomersAPI.findAll();
            setCustomers(data);
            setLoading(false);
            if (!invoice.customer)
                setInvoice({ ...invoice, customer: data[0].id });
        } catch (error) {
            toast.error("erreur lors du chargement des clients");
        }
    };

    //recuperation d'une facture
    const fetchInvoice = async id => {
        try {
            const {amount, status, customer} = await InvoicesAPI.find(id);
            setInvoice({amount, status, customer: customer.id});
            setLoading(false)
        } catch(error){
            toast.error("impossible de charger la facture");
            history.replace('/invoices');
        }
    }

    //recuperation de la listes des clients à chaque chargement du composant
    useEffect(() => {
        fetchCustomers();
    }, []);

    //recuperation de la bonne facture quand l'id de l'url change
    useEffect(() => {
        if(id !== 'new'){
            setEditing(true)
            fetchInvoice(id);
        }
    }, [id]);

    //gestion des changement des inputs dans le formulaire
    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setInvoice({ ...invoice, [name]: value });
    };

    //gestion de la soumission du formulaire
    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(invoice);
        try {
            if(editing){
                await InvoicesAPI.update(id, invoice);
                toast.success("La facture a bien été modifiée 😎");
            } else {
                await InvoicesAPI.create(invoice);
                toast.success("La facture a bien été crée 😎");
                history.replace("/invoices");
            }
            
        } catch (error) {
            if (error.response.data.violations) {
                const apiErrors = {};
                error.response.data.violations.forEach((violation) => {
                    apiErrors[violation.propertyPath] = violation.message;
                });
                setErrors(apiErrors);
                toast.error("Il y a des erreurs dans votre formulaire");
            }
        }
    };

    return (
        <>
            {editing && <h1>Modification d'une facture</h1> || <h1>Création d'une facture</h1>}
            {loading && <FormContentLoader/>}
            {!loading && <form onSubmit={handleSubmit}>
                <Field
                    name="amount"
                    type="number"
                    placeholder="Montant de la facture"
                    label="Montant"
                    onChange={handleChange}
                    value={invoice.amount}
                    error={errors.amount}
                />
                <Select
                    name="customer"
                    label="Client"
                    value={invoice.customer}
                    error={errors.customer}
                    onChange={handleChange}
                >
                    {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                            {customer.firstName} {customer.lastName}
                        </option>
                    ))}
                </Select>
                <Select
                    name="status"
                    label="Statut"
                    value={invoice.status}
                    error={errors.status}
                    onChange={handleChange}
                >
                    <option value="SENT">Envoyée</option>
                    <option value="PAID">Payée</option>
                    <option value="CANCELLED">Annulée</option>
                </Select>
                <div className="form-group">
                    <button type="submit" className="btn btn-success">
                        Enregistrer
                    </button>
                    <Link to="/invoices" className="btn btn-link">
                        Retour à la liste des factures
                    </Link>
                </div>
            </form>}
        </>
    );
};

export default InvoicePage;
