import React, { useEffect, useRef, useState, useCallback } from "react";
import ProfileProperty from "../modular/ProfileProperty";
import Avatar from "../modular/Avatar";

/**
 * 
 * Perfil individual
 * 
 * @returns 
 */
export default function PersonProfilePage() {

    const queryStrings = new URLSearchParams(window.location.search);

    const id = queryStrings.get("id");
    const requester = queryStrings.get("requester");
    const isOwner = id === requester;

    const timeout = useRef(0);
    const startDate = useRef(Date.parse(sessionStorage.getItem("startDate")));
    const expiry = useRef(Date.parse(sessionStorage.getItem("expiry")));

    const [hasFetchedData, setHasFetchedData] = useState(false);
    const [username, setUsername] = useState("");
    const [birthDate, setBirthDate] = useState(new Date());
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState("");



    useEffect(() => {

        var options = {
            method: 'GET',
            redirect: 'follow',
            credentials: "include"
        }
        const queryParams = `?id=${id}&requester=${requester}&isGroup=false`

        fetch(process.env.REACT_APP_API_URL + "/profile/get-profile" + queryParams, options)
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
                return response.json();
            })
            .then(data => {

                setAvatar(data.avatar);
                setUsername(data.username);
                setEmail(data.email);
                setBirthDate(new Date(data.birthDate));
                setHasFetchedData(true);
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
                credentials: "include"
            }

            var queryParams = `?id=${requester}`;
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
            body: JSON.stringify({ Id: requester }),
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

    return (hasFetchedData ?
        <>
            {
                <div className="d-flex justify-content-center" style={{ marginTop: "6%" }}>
                    <div className="row" style={{ width: "100%" }}>
                        <div className="col-lg">
                            <div className="mb-3 d-flex justify-content-center">
                                <Avatar avatarProps={{
                                    src: avatar,
                                    alt: "avatar de " + username,
                                    size: "200px"
                                }}
                                />
                            </div>

                            <div className="mb-3 d-flex justify-content-center">
                                <span><strong>{username}</strong></span>
                            </div>


                            <div className="d-flex flex-column" style={{ marginLeft: "20%", marginRight: "20%" }}>
                                <ProfileProperty
                                    keyProp="ID"
                                    text={id}
                                    isEditing={false}

                                />
                                <ProfileProperty //yyyy-MM-ddThh:mm
                                    keyProp="Data de Nascimento"
                                    text={birthDate.toLocaleDateString()}
                                    isEditing={false}
                                />
                                <ProfileProperty
                                    keyProp="E-mail"
                                    text={email}
                                    isEditing={false}
                                />
                            </div>

                            {isOwner ?
                                <div className="d-flex justify-content-center mt-1 mb-2">
                                    <button
                                        className="btn"
                                        style={{ backgroundColor: "#3b9ae1", color: "white" }}
                                        onClick={() => window.location.assign(`/edit-person-profile?id=${id}`)}
                                    >
                                        Editar perfil
                                    </button>
                                </div>
                                :
                                <></>
                            }
                            <div className="my-2 d-flex justify-content-evenly">
                                <button className="btn btn-link" style={{ color: "#3b9ae1" }} onClick={() => window.location.assign(`/messages?id=${requester}`)}>Voltar à lista de mensagens</button>
                            </div>
                        </div>
                    </div>
                </div>
            }

        </>
        :
        <></>

    );

}