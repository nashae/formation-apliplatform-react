import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import CustomersAPI from "../services/CustomersAPI";
import {Link} from "react-router-dom";
import { toast } from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";

const CustomersPage = (props) => {
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    //permet d'aller recuperer les customers
    const fetchCustomers = async () => {
        try{
            const data = await CustomersAPI.findAll();
            setCustomers(data);
            setLoading(false);
        } catch (error) {
            toast.error("Erreur lors du chargement des clients");
        }
    }

    //au chargement du composant, on va chercher les customers
    useEffect(() => {
        fetchCustomers();
    }, []);

    //gestion de la suppression d'un customer
    const handleDelete = async id => {
        const originalCustomers = [...customers];
        //approche optimiste
        setCustomers(customers.filter((customer) => customer.id !== id));
        //approche pessimiste
        try{
            await CustomersAPI.delete(id);
            toast.success(`Le client n°${id} a bien été supprimé 😎`);
        } catch(error) {
            setCustomers(originalCustomers);
            toast.error("la suppression a échoué");
        }
        /* equivalent à :
        CustomersAPI.delete(id)
            .then((response) => console.log("ok"))
            .catch((error) => {
                setCustomers(originalCustomers);
                console.log(error.response);
            });
        */
    };

    //gestion du changement de page
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    //gestion de la recherche
    const handleSearch = (event) => {
        setSearch(event.currentTarget.value);
        setCurrentPage(1);
    };

    const itemsPerPage = 10;

    //filtrage des customers en fonction de la recherche
    const filteredCustomers = customers.filter(
        (c) =>
            c.firstName.toLowerCase().includes(search.toLowerCase()) ||
            c.lastName.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase()) ||
            (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
    );

    const paginatedCustomers = Pagination.getData(
        filteredCustomers,
        currentPage,
        itemsPerPage
    );

    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
            <h1>Liste des clients</h1>
            <Link to="/customers/new" className="btn btn-primary">Créer un client</Link>
            </div>

            <div className="form-group">
                <input
                    type="text"
                    className="form-control"
                    onChange={handleSearch}
                    value={search}
                    placeholder="Rechercher..."
                />
            </div>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Client</th>
                        <th>Email</th>
                        <th>Entreprise</th>
                        <th className="text-center">Factures</th>
                        <th className="text-center">Montant total</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedCustomers.map((customer) => (
                        <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td>
                                <Link to={"/customers/" + customer.id}>
                                    {customer.firstName} {customer.lastName}
                                </Link>
                            </td>
                            <td>{customer.email}</td>
                            <td>{customer.company}</td>
                            <td className="text-center">
                                <span className="badge badge-primary">
                                    {customer.invoices.length}
                                </span>
                            </td>
                            <td className="text-center">
                                {customer.totalAmount.toLocaleString()}€
                            </td>
                            <td>
                                <button
                                    onClick={() => handleDelete(customer.id)}
                                    disabled={customer.invoices.length > 0}
                                    className="btn btn-sm btn-danger"
                                >
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {loading && <TableLoader />}
            {itemsPerPage < filteredCustomers.length && <Pagination
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                length={filteredCustomers.length}
                onPageChanged={handlePageChange}
            />}
        </>
    );
};

Pagination.getData = (items, currentPage, itemsPerPage) => {
    const start = currentPage * itemsPerPage - itemsPerPage;
    return items.slice(start, start + itemsPerPage);
};

export default CustomersPage;
