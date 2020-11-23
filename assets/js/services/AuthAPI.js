import axios from "axios";
import jwtDecode from "jwt-decode";

//deconnexion , suppression du token du localstorage et sur axios
function logout() {
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
}

//defini le token jwt en default.header 
function setAxiosToken(token) {
    axios.defaults.headers["Authorization"] = "Bearer " + token;
}

//requete http d'auth et stockage du token dans le storage et sur axios
function authenticate(credentials) {
    return axios
        .post("http://localhost:8000/api/login_check", credentials)
        .then((response) => response.data.token)
        .then((token) => {
            window.localStorage.setItem("authToken", token);
            setAxiosToken(token);
        });
}

//mis en place lors du chargement de l'app
function setup() {
    const token = window.localStorage.getItem("authToken");
    if (token) {
        const jwtData = jwtDecode(token);
        if (jwtData.exp * 1000 > new Date().getTime()) {
            setAxiosToken(token);
        }
    }
}

//verifie l'etat de l'authentification
function isAuthenticated(){
    const token = window.localStorage.getItem("authToken");
    if (token) {
        const jwtData = jwtDecode(token);
        if (jwtData.exp * 1000 > new Date().getTime()) {
            return true;
        }
        return false;
    }
    return false;
}

export default {
    authenticate: authenticate,
    logout: logout,
    setup: setup,
    isAuthenticated: isAuthenticated
};
