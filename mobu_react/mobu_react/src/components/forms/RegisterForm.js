import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Avatar from "../modular/Avatar";
import ClickableIcon from "../modular/ClickableIcon";

/**
 * Formulario de registo
 * @returns 
 */
export default function RegisterForm() {

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVerf, setPasswordVerf] = useState("");
    const [dataNascimento, setDataNascimento] = useState(new Date())
    const [avatar, setAvatar] = useState(new File([""], ""));
    const [warningText, setWarningText] = useState("");

    const avatarImg = useMemo(() => {
        return <>
            <div className="d-flex justify-content-center">
                <Avatar avatarProps={{
                    src: "./assets/images/default_avatar.png",
                    size: "200px",
                    alt: "Meu avatar"
                }}
                />
            </div>

            <div className="mb-3 d-flex justify-content-center">
                <input
                    type="file"
                    style={{ display: "none" }}
                    className="avatar-input rounded-4 border border-3 border-secondary-subtle form-control"
                    onChange={e => handleAvatarChange(e.target)}
                    accept=".jpg,.jpeg,.png"
                />
                <ClickableIcon
                    CIProps={{
                        size: "3rem",
                        fill: "none",
                        path: {
                            d: "M32.25 3.58331L39.4166 10.75M3.58331 39.4166L5.8702 31.0314C6.0194 30.4843 6.094 30.2108 6.20852 29.9557C6.3102 29.7292 6.43515 29.5139 6.58134 29.3133C6.74599 29.0873 6.94647 28.8868 7.34743 28.4859L25.8615 9.97183C26.2162 9.61707 26.3936 9.43969 26.5982 9.37322C26.7781 9.31476 26.9719 9.31476 27.1518 9.37322C27.3564 9.43969 27.5337 9.61707 27.8885 9.97183L33.0281 15.1115C33.3829 15.4662 33.5603 15.6436 33.6267 15.8482C33.6852 16.0281 33.6852 16.2219 33.6267 16.4018C33.5603 16.6064 33.3829 16.7837 33.0281 17.1385L14.5141 35.6525C14.1131 36.0535 13.9127 36.254 13.6867 36.4186C13.486 36.5648 13.2707 36.6898 13.0442 36.7914C12.7892 36.906 12.5156 36.9806 11.9686 37.1298L3.58331 39.4166Z",
                            stroke: "gray",
                            strokeWidth: "2",
                            strokeLinecap: "round",
                            strokeLinejoin: "round"
                        }
                    }}
                    onIconClick={handleIconClick}
                />
            </div>
        </>;
    }, [avatar])

    /**
     * mudanca no estado do nome de utilizador
     */
    function handleUsernameChange(value) {
        setUsername(value);
    }

    /**
     * mudanca no estado do email
     */
    function handleEmailChange(value) {
        setEmail(value);
    }

    /**
     * mudanca no estado da password
     */
    function handlePasswordChange(value) {
        setPassword(value);
    }

    /**
     * mudanca no estado da verificacao da password
     */
    function handlePasswordVerfChange(value) {
        setPasswordVerf(value);
    }

    /**
     * mudanca no estado da data de nascimento
     */
    function handleDataNascimentoChange(value) {
        setDataNascimento(value);
    }

    /**
     * mudanca no estado do avatar do utilizador
     */
    function handleAvatarChange(value) {
        displayImage(value)
        setAvatar(value.files[0]);
    }

    /**
     * mostrar imagem introduzida
     */
    function displayImage(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                document.getElementsByClassName('avatar')[0].setAttribute('src', e.target.result);
            };

            reader.readAsDataURL(input.files[0]);
        }
    }

    /** 
     * executar no clique no icone
     */
    function handleIconClick() {
        document.getElementsByClassName('avatar-input')[0].click();
    }

    /**
     * executar no clique no botao de submissao
     */
    async function handleButtonClick() {

        var formData = new FormData();

        formData.append("NomeUtilizador", username);
        formData.append("Email", email);
        formData.append("Password", password);
        formData.append("DataNascimento", dataNascimento);
        formData.append("Avatar", avatar);

        var options = {
            method: 'POST',
            body: formData
        }

        if (password === passwordVerf) {
            await fetch(process.env.REACT_APP_API_URL + "/register", options)
                .then((response) => {
                    if (response.status === 200) {
                        window.location.assign("./")
                    }
                    else if (response.status === 409) {
                        setWarningText("Nome de utilzador escolhdo já existe!");
                    }
                    else if (response.status === 400) {
                        setWarningText("Todos os campos são obrigatórios!");
                    }
                    else if (response.status === 403) {
                        setWarningText("Introduza um e-mail válido!");
                    }
                    else {
                        setWarningText("Tentativa de registo inválida!");
                    }
                })
                .catch(err => { console.error("error", err) });
        } else {
            setWarningText("Passwords têm que conicidir!");
        }

    }

    return (
        <div className="d-flex justify-content-center" style={{ marginTop: "5rem" }}>
            <div className="rounded-4 border border-3 border-secondary-subtle p-3" style={{ backgroundColor: "lightblue" }}>
                <div className="row">
                    <div className="col-lg mt-lg-5">
                        {avatarImg}
                    </div>
                    <div className="col-lg">
                        {warningText !== "" ?
                            <div>
                                <span style={{ color: "#ff5f4a" }}>{warningText}</span>
                            </div> : <></>
                        }

                        <div className="my-2">
                            <label className="form-label">&nbsp;&nbsp;&nbsp;<strong>Nome de Utilizador</strong></label>
                            <br />
                            <input
                                type="text"
                                value={username}
                                className="rounded-4 border border-3 border-secondary-subtle form-control"
                                onChange={e => handleUsernameChange(e.target.value)}
                            />
                        </div>

                        <div className="mt-3 mb-2">
                            <label className="form-label">&nbsp;&nbsp;&nbsp;<strong>E-mail</strong></label>
                            <br />
                            <input
                                type="email"
                                value={email}
                                className="rounded-4 border border-3 border-secondary-subtle form-control"
                                onChange={e => handleEmailChange(e.target.value)}
                            />
                        </div>

                        <div className="mt-3 mb-2">
                            <label className="form-label">&nbsp;&nbsp;&nbsp;<strong>Data de Nascimento</strong></label>
                            <br />
                            <input
                                type="datetime-local"
                                value={dataNascimento}
                                className="rounded-4 border border-3 border-secondary-subtle form-control"
                                onChange={e => handleDataNascimentoChange(e.target.value)}
                            />
                        </div>

                        <div className="mt-3 mb-2">
                            <label className="form-label">&nbsp;&nbsp;&nbsp;<strong>Palavra-passe</strong></label>
                            <br />
                            <input
                                type="password"
                                value={password}
                                className="rounded-4 border border-3 border-secondary-subtle form-control"
                                onChange={e => handlePasswordChange(e.target.value)}
                            />
                        </div>

                        <div className="mt-3 mb-2">
                            <label className="form-label">&nbsp;&nbsp;&nbsp;<strong>Repetir Palavra-passe</strong></label>
                            <br />
                            <input
                                type="password"
                                value={passwordVerf}
                                className="rounded-4 border border-3 border-secondary-subtle form-control"
                                onChange={e => handlePasswordVerfChange(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="d-flex justify-content-center mb-2">
                        <button className="btn" style={{ backgroundColor: "#3b9ae1", color: "white" }} onClick={() => handleButtonClick()}>Registar</button>
                    </div>

                    <div className="my-2 d-flex justify-content-evenly">
                        <a href={window.location.origin} style={{ color: "#3b9ae1" }}>Já tenho conta</a>
                    </div>
                </div>
            </div>
        </div>
    );
}