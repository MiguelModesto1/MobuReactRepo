import React, { useMemo, useState, useEffect, useRef } from "react";
import Avatar from "../modular/Avatar";
import ClickableIcon from "../modular/ClickableIcon";

/**
 * Formulario de fundacao de grupos
 * 
 * @returns 
 */
export default function GroupFoundationForm() {

    const queryStrings = new URLSearchParams(window.location.search);

    const adminId = Number(queryStrings.get("id"));


    const timeout = useRef(0);
    const startDate = useRef(Date.parse(sessionStorage.getItem("startDate")));
    const expiry = useRef(Date.parse(sessionStorage.getItem("expiry")));

    const [groupName, setGroupName] = useState("");
    const [localAvatar, setLocalAvatar] = useState(new File([""], ""));
    const [warningText, setWarningText] = useState("");

    useEffect(() => {

        var options = {
            method: 'GET',
            redirect: 'follow',
            credentials: "include",
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        }
        const queryParams = `?id=${adminId}`

        fetch(process.env.REACT_APP_API_URL + "/get-group-foundation" + queryParams, options)
            .then((response) => {
                if (response.status === 404) {
                    window.location.assign("/error-404");
                }
                else if (response.status === 500) {
                    window.location.assign("/error-500");
                }
                else if (response.status === 403) {
                    window.location.assign("/error-403");
                }
                else if (response.status === 401) {
                    window.history.back();
                }
            })
            .catch((err) => { console.error("error: ", err) });

        //verificar novo cookie
        document.addEventListener("mousemove", () => getNewCookie());
        document.addEventListener("keydown", () => getNewCookie());


        var expiryIntervalInit = expiry.current - startDate.current;
        
        if (expiryIntervalInit !== 15 * 1000 * 60) {
            window.location.assign("/");
        }

        var expiryInterval = expiry.current - Date.now();

        timeout.current = setTimeout(() => {
            logout();
            window.location.assign("/");

        }, expiryInterval);
    }, []);

    const getNewCookie = async () => {

        console.log("getNewCookie!!");
        
        var expiryInterval = expiry.current - Date.now();

        if (expiryInterval < (15 * 1000 * 60) / 2) {

            var options = {
                method: "GET",
                redirect: "follow",
                credentials: "include",
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                }
            }

            var queryParams = `?id=${adminId}`;
            await fetch(process.env.REACT_APP_API_URL + "/get-new-cookie" + queryParams, options)
                .then(response => {
                    if (response.status === 401) {
                        window.history.back();
                    }
                    return response.json();
                })
                .then(data => {
                    sessionStorage.setItem("expiry", data.expiryDate);
                    sessionStorage.setItem("startDate", data.startDate);
                    expiry.current = Date.parse(data.expiryDate);
                    startDate.current = Date.parse(data.sartDate);

                    expiryInterval = expiry.current - Date.now();

                    clearTimeout(timeout.current);
                    timeout.current = setTimeout(
                        () => {
                            logout();
                            window.location.assign("/");

                        }, expiryInterval);
                })
                .catch(err => console.error("error: ", err));
        }
    }

    /**
     * funcao de logout
     */
    const logout = async () => {

        sessionStorage.removeItem("expiry");
        sessionStorage.removeItem("startDate");

        var options = {
            method: "POST",
            redirect: "follow",
            body: JSON.stringify({ Id: adminId }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            credentials: "include"
        }

        await fetch(process.env.REACT_APP_API_URL + "/logout", options)
            .then(response => {
                if (response.status === 404) {
                    window.location.assign("/error-404");
                }
                else if (response.status === 500) {
                    window.location.assign("/error-500");
                }
            })
            .catch(err => console.error("error: ", err));
    }

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
                    onChange={e => handleLocalAvatarChange(e.target)}
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
    }, [localAvatar]);

    /**
     * callback para a mudanca de nome
     * @param {any} value
     */
    function handleGroupNameChange(value) {
        setGroupName(value);
    }

    /**
     * callback para a mudanca de avatar
     * @param {any} value
     */
    function handleLocalAvatarChange(value) {
        displayImage(value);
        setLocalAvatar(value.files[0]);
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
     * Executar no clique do ícone
     */
    function handleIconClick() {
        document.getElementsByClassName('avatar-input')[0].click();
    }

    /**
     * Executar no clique do botão para fundar grupo
     */
    async function handleButtonClick() {

        var formData = new FormData();

        formData.append("AdminId", adminId);
        formData.append("NomeSala", groupName);
        formData.append("Avatar", localAvatar);

        var options = {
            method: 'POST',
            body: formData,
            credentials: "include"
        }

        await fetch(process.env.REACT_APP_API_URL + "/group-foundation", options)
            .then((response) => {
                debugger;
                if (response.status === 404) {
                    window.location.assign("error-404");
                }
                else if (response.status === 500) {
                    window.location.assign("/error-500");
                }
                else if (response.status === 403) {
                    window.location.assign("/error-403");
                }
                else if (response.status === 401) {
                    window.history.back();
                }
                else if (response.status === 400)
                    setWarningText("Tentativa de fundação de grupo inválida");

                window.location.assign(`/messages?id=${adminId}`);

            })
            .catch(err => { console.error("error", err) });
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
                            </div>
                            :
                            <></>
                        }

                        <div className="my-2">
                            <label className="form-label">&nbsp;&nbsp;&nbsp;<strong>Nome do Grupo</strong></label>
                            <br />
                            <input
                                type="text"
                                value={groupName}
                                className="rounded-4 border border-3 border-secondary-subtle form-control"
                                onChange={e => handleGroupNameChange(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="d-flex justify-content-center mb-2">
                    <button className="btn" style={{ backgroundColor: "#3b9ae1", color: "white" }} onClick={() => handleButtonClick()}>Fundar grupo</button>
                </div>

                <div className="my-2 d-flex justify-content-evenly">
                    <button className="btn btn-link" style={{ color: "#3b9ae1" }} onClick={() => window.location.assign(`/messages?id=${adminId}`)}>Voltar à lista de mensagens</button>
                </div>
            </div>
        </div>
    );
}