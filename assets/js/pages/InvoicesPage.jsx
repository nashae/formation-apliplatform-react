import moment from "moment";
import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import InvoicesAPI from "../services/InvoicesAPI";

const STATUS_CLASSES = {
    PAID: "success",
    SENT: "primary",
    CANCELLED: "danger"
}

const STATUS_LABELS = {
    PAID: "Payée",
    SENT: "Envoyée",
    CANCELLED: "Annulée"
}

const InvoicesPage = (props) => {
    
    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    
    const formatDate = (str) => moment(str).format('DD/MM/YYYY');
    const itemsPerPage = 10;

    //recuperation des invoices via invoicesAPI
    const fetchInvoices = async () => {
        try {
            const data = await InvoicesAPI.findAll();
            setInvoices(data);
        setInvoices(data)
        } catch (error) {
            console.log(error.response);
        }
    }

    //charger les invoices au chargement du composant
    useEffect(() => {
        fetchInvoices();
    }, []);


    //gestion du changement de page
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    //gestion de la recherche
    const handleSearch = (event) => {
        setSearch(event.currentTarget.value);
        setCurrentPage(1);
    };

    //gestion suppression
    const handleDelete = async id => {
        const originalInvoices = [...invoices];
        setInvoices(invoices.filter(invoice => invoice.id !== id));
        try{
            await InvoicesAPI.delete(id)
        } catch (error){
            console.log(error.response);
            setInvoices(originalInvoices);
        }
    }

    
    //filtrage des invoices en fonction de la recherche
    const filteredInvoices = invoices.filter(
        (i) =>
            i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
            i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
            STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase()) ||
            i.amount.toString().startsWith(search.toLowerCase())
    );

    //pagination des donnéees
    const paginatedInvoices = Pagination.getData(
        filteredInvoices,
        currentPage,
        itemsPerPage
    );


    return ( 
        <>
            <h1>liste des factures</h1>

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
                    <th>Numero</th>
                    <th>Client</th>
                    <th className="text-center">date d'envoi</th>
                    <th className="text-center">Statut</th>
                    <th className="text-center">Montant</th>
                    <th></th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedInvoices.map(invoice => <tr key={invoice.id}>
                        <td>{invoice.chrono}</td>
                        <td><a href="#">{invoice.customer.firstName} {invoice.customer.lastName}</a></td>
                        <td className="text-center">{formatDate(invoice.sentAt)}</td>
                        <td className="text-center"><span className={"badge badge-" + STATUS_CLASSES[invoice.status]}>{STATUS_LABELS[invoice.status]}</span></td>
                        <td className="text-center">{invoice.amount.toLocaleString()} €</td>
                        <td>
                            <button className="btn btn-sm btn-primary">Editer</button>
                            <button className="btn btn-sm btn-danger ml-1" onClick={() => handleDelete(invoice.id)}>Supprimer</button>
                        </td>
                    </tr>)}
                </tbody>
            </table>
            {<Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} onPageChanged={handlePageChange} length={filteredInvoices.length} />}
        </>
     );
}
 
export default InvoicesPage;