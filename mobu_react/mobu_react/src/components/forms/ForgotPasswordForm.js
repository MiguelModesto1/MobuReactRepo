import React, { useState } from "react";

/**
 * Formulario de password esquecida
 * @returns 
 */
export default function ForgotPasswordForm() {

    const [email, setEmail] = useState("");
    const [warningText, setWarningText] = useState("");

    /**
     * mudanca no estado do email
     */
    function handleEmailChange(value) {
        setEmail(value);
    }
    /**
     * clique no botao de submissao
     */
    async function handleButtonClick() {

        var options = {
            method: 'POST',
            redirect: 'follow',
            body: JSON.stringify({
                Email: email
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        }

        await fetch(process.env.REACT_APP_API_URL + "/forgot-password/send-email", options)
            .then((response) => {
                if (response.status !== 200) {
                    setWarningText("Tentativa de envio de email inválida");
                }
            })
            .catch(err => { console.error("error", err) });
    }

    return (
        <div className="d-flex justify-content-center" style={{ marginTop: "15rem"}}>
            <div className="row" style={{ width: "75%" }}>
                <div className="d-flex justify-content-center col-lg">
                    <div className="container rounded-4 border border-3 border-secondary-subtle mx-auto" style={{ backgroundColor: "lightblue" }}>
                        {warningText !== "" ?
                            <div>
                                <span style={{ color: "#ff5f4a" }}>{warningText}</span>
                            </div> : <></>
                        }
                        <div className="my-2">
                            <label className="form-label">&nbsp;&nbsp;&nbsp;<strong>Insira o seu E-mail</strong></label>
                            <input
                                type="email"
                                value={email}
                                className="rounded-4 border border-3 border-secondary-subtle form-control"
                                onChange={e => handleEmailChange(e.target.value)}
                            />
                        </div>
                        <div className="d-flex justify-content-center mb-2">
                            <button className="btn" style={{ backgroundColor: "#3b9ae1", color: "white" }} onClick={() => handleButtonClick()} >Enviar E-mail</button>
                        </div>
                        <div className="my-2 d-flex justify-content-evenly">
                            <a href={window.location.origin} style={{ color: "#3b9ae1" }}>Voltar ao login</a>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    );


}