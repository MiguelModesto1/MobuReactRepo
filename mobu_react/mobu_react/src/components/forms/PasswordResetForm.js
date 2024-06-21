import React, { useState } from "react";

/**
 * Formulario de mudanca de password
 * @returns 
 */
export default function PasswordResetForm() {

    const email = new URLSearchParams(window.location.search).get('email');

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passwordVerf, setPasswordVerf] = useState("");
    const [warningText, setWarningText] = useState("");

    /**
     * mudanca no estado da password atual
     */
    function handleCurrentPasswordChange(value) {
        setCurrentPassword(value);
    }

    /**
     * mudanca no estado da nova password
     */
    function handleNewPasswordChange(value) {
        setNewPassword(value);
    }

    /**
     * mudanca no estado da repeticao da nova password
     */
    function handlePasswordVerfChange(value) {
        setPasswordVerf(value);
    }

    /**
     * clique no botao de submissao
     */
    async function handleButtonClick() {

        var options = {
            method: 'POST',
            redirect: 'follow',
            body: JSON.stringify({
                NewPassword: newPassword,
                CurrentPassword: currentPassword,
                Email: email
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        }

        if (newPassword === passwordVerf) {
            await fetch(process.env.REACT_APP_API_URL + "/forgot-password/reset-password", options)
                .then((response) => {
                    if (response.status === 200) {
                        window.location.assign("/")
                    } else {
                        setWarningText("Tentativa de reiniciar password inválida");
                    }
                })
                .catch(err => { console.error("error", err) });
        } else {
            setWarningText("Passwords têm que conicidir!");
        }
    }

    return (
        <div className="d-flex justify-content-center" style={{ marginTop: "12rem" }}>
            <div className="row" style={{ width: "75%" }}>
                <div className="d-flex justify-content-center col-lg">
                    <div className="container rounded-4 border border-3 border-secondary-subtle mx-auto" style={{ backgroundColor: "lightblue" }}>
                        {warningText !== "" ?
                            <div>
                                <span className="text-danger" style={{ color: "#ff5f4a" }}>{warningText}</span>
                            </div>
                            :
                            <></>
                        }
                        <div className="my-2">
                            <label className="form-label">&nbsp;&nbsp;&nbsp;<strong>Palavra-passe Atual</strong></label>
                            <input
                                type="password"
                                value={currentPassword}
                                className="rounded-4 border border-3 border-secondary-subtle form-control"
                                onChange={e => handleCurrentPasswordChange(e.target.value)}
                            />
                        </div>

                        <div className="mt-3 mb-2">
                            <label className="form-label">&nbsp;&nbsp;&nbsp;<strong>Nova Palavra-passe</strong></label>
                            <input
                                type="password"
                                value={newPassword}
                                className="rounded-4 border border-3 border-secondary-subtle form-control"
                                onChange={e => handleNewPasswordChange(e.target.value)}
                            />
                        </div>

                        <div className="mt-3 mb-2">
                            <label className="form-label">&nbsp;&nbsp;&nbsp;<strong>Repetir Nova Palavra-passe</strong></label>
                            <input
                                type="password"
                                value={passwordVerf}
                                className="rounded-4 border border-3 border-secondary-subtle form-control"
                                onChange={e => handlePasswordVerfChange(e.target.value)}
                            />
                        </div>
                        <div className="d-flex justify-content-center mb-2">
                            <button className="btn" style={{ backgroundColor: "#3b9ae1", color: "white" }} onClick={() => handleButtonClick()}>Mudar palavra-passe</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );


}