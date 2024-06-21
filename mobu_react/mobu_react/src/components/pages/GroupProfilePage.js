import { HttpTransportType, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ProfileProperty from "../modular/ProfileProperty";
import Avatar from "../modular/Avatar";
import GroupMemberItem from "../modular/GroupMemberItem"

/**
 * 
 * Perfil de grupo
 * 
 * @returns 
 */
export default function GroupProfilePage() {

    const queryStrings = new URLSearchParams(window.location.search);

    const id = Number(queryStrings.get("id"));
    const requester = Number(queryStrings.get("requester"));

    const timeout = useRef(0);
    const startDate = useRef(Date.parse(sessionStorage.getItem("startDate")));
    const expiry = useRef(Date.parse(sessionStorage.getItem("expiry")));
    const connection = useRef();

    const [hasFetchedData, setHasFetchedData] = useState(false);
    const [isRequesterAdmin, setIsRequesterAdmin] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [avatar, setAvatar] = useState("");
    const [members, setMembers] = useState([{
        Id: -1,
        Username: "",
        ImageURL: "",
        IsAdmin: false
    }]);

    /**
     * Ouvir rececao de expulsao
     * @param {any} connection
     */
    const listenToMemberExpelling = useCallback((connection) => {
        connection.on("ReceiveExpelling", (memberId, message) => {
            var aux = [];
            
            for (var i = 0; i < members.length; i++) {
                if (members[i].Id + "" !== memberId) {
                    aux.push({ ...members[i] });
                }
            };

            setMembers([...aux]);

            console.log(message);
        })
    }, [members]);

    useEffect(() => {
        if (hasFetchedData) {
            listenToMemberExpelling(connection.current);
        }
        else {
            var options = {
                method: 'GET',
                redirect: 'follow',
                credentials: "include"
            }
            const queryParams = `?id=${id}&requester=${requester}&isGroup=true`

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
                    setGroupName(data.groupName);
                    setMembers([...data.members]);
                    setIsRequesterAdmin(data.isRequesterAdmin || data.isRequesterAdmin === "true");
                    setHasFetchedData(true);
                })
                .catch((err) => { console.error("error: ", err) });

            connection.current =
                new HubConnectionBuilder().withUrl(process.env.REACT_APP_HUB_URL + "/RealTimeHub", {
                    skipNegotiation: true,
                    transport: HttpTransportType.WebSockets
                })
                    .configureLogging(LogLevel.Debug)
                    .build();
            
            connection.current.start();
            logSignalRAccess(connection.current);
            listenToSignalRLeaving(connection.current);

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
        }
    }, [hasFetchedData, listenToMemberExpelling]);

    /**
     * obter novo cookie a partir da meia-vida
     */
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

        await connection.current.stop();
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

    /**
     * mensagem de log do signalR ao conectar
     * 
     * @param {any} connection
     */
    const logSignalRAccess = (connection) => {
        connection.on("OnConnectedAsyncPrivate", message => {
            console.log(message);
        });
    }

    /**
     * mensagem do signalR ao desconectar
     * 
     * @param {any} connection
     */
    const listenToSignalRLeaving = (connection) => {
        connection.on("OnDisconnectedAsyncPrivate", message => {
            console.log(message);
        });
    }

    const mapMembers = members.map((member) => {        

        return (
            <GroupMemberItem
                requester={requester}
                key={member.Id}
                avatar={member.ImageURL}
                personId={member.Id}
                personName={member.Username}
                isAdmin={member.IsAdmin}
                isRequesterAdmin={isRequesterAdmin}
                connection={connection.current}
                roomId={id}
            />
        );
    });

    return (
        <>
            {hasFetchedData ?
                <div className="d-flex justify-content-center" style={{ marginTop: "1%" }}>
                    <div className="row" style={{ width: "100%" }}>
                        <div className="col-lg">
                            <div className="mb-3 d-flex justify-content-center">
                                <Avatar avatarProps={{
                                    src: avatar,
                                    alt: "avatar de " + groupName,
                                    size: "200px"
                                }}
                                />
                            </div>

                            <div className="mb-3 d-flex justify-content-center">
                                <span><strong>{groupName}</strong></span>
                            </div>

                            <div className="d-flex flex-column" style={{ marginLeft: "20%", marginRight: "20%" }}>
                                <ProfileProperty
                                    keyProp="ID"
                                    text={id}
                                    isEditing={false}
                                />
                            </div>

                            <div className="mb-3 d-flex justify-content-center">
                                <span><strong>Integrantes:</strong></span>
                            </div>

                            <div className="d-flex justify-content-center col-lg mb-3" style={{ marginLeft: "20%", marginRight: "20%" }}>
                                <div className="container px-0 rounded-4 border border-3 border-secondary-subtle mx-auto" style={{ overflow: "auto", maxHeight: "16.313rem" }}>
                                    {mapMembers}
                                </div>
                            </div>

                            {
                                isRequesterAdmin ?
                                    <div className="d-flex justify-content-center mt-1 mb-2">
                                        <button
                                            className="btn"
                                            style={{ backgroundColor: "#3b9ae1", color: "white" }}
                                            onClick={() => window.location.assign(`/edit-group-profile?id=${id}&admin=${requester}`)}
                                        >
                                            Editar grupo
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
                :
                <></>
            }
        </>

    );

}