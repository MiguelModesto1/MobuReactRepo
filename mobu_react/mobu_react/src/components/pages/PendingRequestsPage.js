import React, { useState, useEffect, useRef } from "react";
import { HttpTransportType, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import PendingRequestItem from "../modular/PendingRequestItem";

/**
 * Pagina de pedidos pendentes
 * @returns
 */
export default function PendingRequestsPage() {

    const queryParams = new URLSearchParams(window.location.search);

    const owner = useRef(parseInt(queryParams.get("id")));
    const connection = useRef();
    const timeout = useRef(0);
    const startDate = useRef(Date.parse(sessionStorage.getItem("startDate")));
    const expiry = useRef(Date.parse(sessionStorage.getItem("expiry")));

    const [hasFetchedData, setHasFetchedData] = useState(false);
    const [requestItems, setRequestItems] = useState([{
        DestID: -1,
        RemID: -1,
        RemName: "",
        ImageURL: ""
    }]);
    const [show404Text, setShow404Text] = useState(false);

    useEffect(() => {
        var options = {
            method: 'GET',
            redirect: 'follow',
            credentials: "include"
        }
        const queryParams = `?id=${owner.current}`

        fetch(process.env.REACT_APP_API_URL + "/pending-requests" + queryParams, options)
            .then((response) => {
                
                if (response.status === 404) {
                    setShow404Text(true);
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
                setRequestItems([...data.pendingRequests]);
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

            var queryParams = `?id=${owner.current}`;
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

    };

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
            body: JSON.stringify({ Id: owner.current }),
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

    /**
     * mapear pedidos a items JSX
     */
    const mapRequestItems = requestItems.map((item) => {
        return (
            <PendingRequestItem
                key={item.RemID}
                connection={connection.current}
                ownerId={owner.current}
                personId={item.RemID}
                name={item.RemName}
                avatar={item.ImageURL}
            />
        );
    });

    return (
        <div className="d-flex justify-content-center" style={{ marginTop: "10rem" }}>
            <div style={{ width: "100%" }}>
                <div className="d-flex justify-content-center" style={{ marginLeft: "15%", marginRight: "15%" }}>
                    <div className="container rounded-4 border border-3 border-secondary-subtle" style={{ backgroundColor: "lightblue" }}>
                        <div className="container rounded-4 border border-3 border-secondary-subtle p-1 mt-2" style={{ overflow: "overlay", maxHeight: "16.313rem" }}>
                            {
                                show404Text &&
                                <div className="d-flex justify-content-center">
                                    <span className="text-center"><strong>Sem resultados</strong></span>
                                </div>
                            }
                            <div style={{ overflowX: "hidden" }} className="d-flex flex-column">
                                {
                                    hasFetchedData &&
                                    <>
                                        <span className="text-center"><strong>Pedidos pendentes:</strong></span>
                                        <br />
                                        {mapRequestItems}
                                    </>
                                }
                            </div>
                        </div>
                        <div className="my-2 d-flex justify-content-evenly">
                            <button className="btn rounded-4"
                                style={{ backgroundColor: "#3b9ae1", color: "white" }}
                                onClick={() => window.location.assign(`/messages?id=${owner.current}`)}
                            >
                                Voltar à lista de mensagens
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}