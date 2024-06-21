import React, { useState, useEffect } from "react";
/**
 * Formulario de login
 * @returns 
 */
export default function LoginForm() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [warningText, setWarningText] = useState("");

    /**
     * mudanca no estado do nome de utilizador
     */
    function handleUsernameChange(value) {
        setUsername(value);
    }

    /**
     * mudanca no estado da palavra-passe
     */
    function handlePasswordChange(value) {
        setPassword(value);
    }

    //useEffect(() => {

    //    var options = {
    //        method: 'GET',
    //        redirect: 'follow',
    //        headers: {
    //            'Content-type': 'charset=UTF-8'
    //        },
    //        credentials: "include"
    //    }

    //    fetch(process.env.REACT_APP_API_URL + "/get-login", options)
    //        .then((response) => {
    //            
    //            if (response.status === 200) {
    //                return response.json();
    //            }
    //            //return;
    //        })
    //        .then(data => {
    //            window.location.assign("/messages?id=" + data.userId);
    //        })
    //        .then(data => console.log(data))
    //        .catch(err => { console.error("error", err) });



    //}, [])

    /**
     * clique no botao de submissao
     */
    async function handleButtonClick() {
        
        var options = {
            method: 'POST',
            redirect: 'follow',
            body: JSON.stringify({
                NomeUtilizador: username,
                Password: password
            }).toString(),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            credentials: "include"
        }

        await fetch(process.env.REACT_APP_API_URL + "/login", options)
            .then((response) => {
                
                if (response.status === 404) {
                    setWarningText("Tentativa de login inválida!");
                } else {
                    return response.json();
                }

            })
            .then(data => {
                sessionStorage.setItem("expiry", data.expiryDate);
                sessionStorage.setItem("startDate", data.startDate);
                window.location.assign("/messages?id=" + data.userId);
            })
            .then(data => console.log(data))
            .catch(err => { console.error("error", err) });
    }

    return (
        <>
            <div className="d-flex justify-content-center" style={{ marginTop: "15%" }}>
                <div className="row" style={{ width: "100%" }}>
                    <div
                        className="d-flex justify-content-center col-lg"
                        style={{ cursor: "pointer" }}
                        onClick={() => window.location.assign("/authors")}
                    >
                        <img className="rounded img-fluid" src="./assets/images/logo_min.png" alt="mobu logo" />
                    </div>
                    <div className="d-flex justify-content-center col-lg" style={{ marginRight: "15%" }}>
                        <div className="container rounded-4 border border-3 border-secondary-subtle mx-auto" style={{ backgroundColor: "lightblue" }}>
                            {warningText !== "" ?
                                <div>
                                    <span style={{ color: "#ff5f4a" }}>{warningText}</span>
                                </div> : <></>
                            }
                            <div className="my-2">
                                <label className="form-label">&nbsp;&nbsp;&nbsp;<strong>Nome de Utilizador</strong></label>
                                <input
                                    type="text"
                                    value={username}
                                    className="rounded-4 border border-3 border-secondary-subtle form-control"
                                    onChange={e => handleUsernameChange(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">&nbsp;&nbsp;&nbsp;<strong>Palavra-passe</strong></label>
                                <input
                                    type="password"
                                    value={password}
                                    className="rounded-4 border border-3 border-secondary-subtle form-control"
                                    onChange={e => handlePasswordChange(e.target.value)}
                                />
                            </div>
                            <div className="d-flex justify-content-center mb-2">
                                <button className="btn" style={{ backgroundColor: "#3b9ae1", color:"white" }} onClick={() => handleButtonClick()}>Log in</button>
                            </div>
                            <div className="my-2 d-flex justify-content-center" style={{ textAlign: "center" }}>
                                <a href={window.location.origin + "/forgot-password"} style={{ color: "#3b9ae1" }}>Esqueci-me da palavra-passe</a>
                                <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                <a href={window.location.origin + "/register"} style={{ color: "#3b9ae1" }}>Não tenho uma conta</a>
                            </div>
                            <div className="my-2 d-flex justify-content-center" style={{ textAlign: "center" }}>
                                <a href={process.env.REACT_APP_BACKOFFICE_URL} style={{ color: "#3b9ae1" }}>Sou moderador/a</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}