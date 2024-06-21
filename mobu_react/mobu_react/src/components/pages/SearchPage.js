import React, { useState, useEffect, useRef } from "react";
import ClickableIcon from "../modular/ClickableIcon";
import PersonGroupFoundItem from "../modular/PersonGroupFoundItem";
import { HttpTransportType, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";


/**
 * Barra de pesquisa de pessoas
 * @returns 
 */
export default function SearchPage() {

    const queryParams = new URLSearchParams(window.location.search);

    const owner = useRef(parseInt(queryParams.get("id")));
    const connection = useRef();
    const timeout = useRef(0);
    const startDate = useRef(Date.parse(sessionStorage.getItem("startDate")));
    const expiry = useRef(Date.parse(sessionStorage.getItem("expiry")));

    const [showList, setShowList] = useState(false);
    const [hasFetchedPeopleData, setHasFetchedPeopleData] = useState(false);
    const [hasFetchedGroupsData, setHasFetchedGroupsData] = useState(false);
    const [userItems, setUserItems] = useState([{
        Id: -1,
        Nome: "",
        Email: "",
        ImageURL: ""
    }]);
    const [groupItems, setGroupItems] = useState([{
        Id: -1,
        Nome: "",
        ImageURL: ""
    }]);
    const [searchText, setSearchText] = useState("");
    const [show404Text, setShow404Text] = useState(false);
    const [show400Text, setShow400Text] = useState(false);

    useEffect(() => {
        var options = {
            method: 'GET',
            redirect: 'follow',
            credentials: "include"
        }
        const queryParams = `?id=${owner.current}`

        fetch(process.env.REACT_APP_API_URL + "/get-search-page" + queryParams, options)
            .then((response) => {
                
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
     * Clique no botao de pesquisa
     */
    async function handleIconClick() {

        if (!showList) {
            setShowList(true);
        }
        setShow400Text(false);
        setShow404Text(false);
        setHasFetchedGroupsData(false);
        setHasFetchedPeopleData(false);

        let options = {
            method: 'GET',
            redirect: 'follow',
            credentials: "include"
        }

        const queryStrings = `?id=${owner.current}&searchString=${searchText}`

        fetch(process.env.REACT_APP_API_URL + "/search" + queryStrings, options)
            .then((response) => {
                if (response.status === 404) {
                    setShow404Text(true);
                }
                else if (response.status === 400) {
                    setShow400Text(true);
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
            .then((data) => {

                if (data.unknownPeople.length !== 0) {
                    setHasFetchedPeopleData(true);
                    setUserItems(data.unknownPeople);
                }
                else {
                    setHasFetchedPeopleData(false);
                }

                if (data.unknownGroups.length !== 0) {
                    setHasFetchedGroupsData(true);
                    setGroupItems(data.unknownGroups)
                }
                else {
                    setHasFetchedGroupsData(false);
                }
            })
            .catch((err) => { console.error("error", err) });
    }

    const handleSearchTextChange = (value) => {
        setSearchText(value);
    }

    /**
     * mapear pessoas a items JSX
     */
    const mapPeopleItems = userItems.map((item) => {
        return (
            <PersonGroupFoundItem
                key={item.Id}
                connection={connection.current}
                ownerId={owner.current}
                personRoomId={item.Id}
                name={item.Nome}
                avatar={item.ImageURL}
                email={item.Email}
                isGroup={false}
            />
        );
    });

    /**
     * mapear grupos a items JSX
     */
    const mapGroupsItems = groupItems.map((item) => {
        return (
            <PersonGroupFoundItem
                key={item.Id}
                connection={connection.current}
                ownerId={owner.current}
                personRoomId={item.Id}
                name={item.Nome}
                avatar={item.ImageURL}
                isGroup={true}
            />
        );
    });

    return (
        <div className="d-flex justify-content-center" style={{ marginTop: "10rem" }}>
            <div style={{ width: "100%" }}>
                <div className="d-flex justify-content-center" style={{ marginLeft: "15%", marginRight: "15%" }}>
                    <div className="container rounded-4 border border-3 border-secondary-subtle" style={{ backgroundColor: "lightblue" }}>
                        <div className="my-3 row">
                            <div className="col-lg-11">
                                <input
                                    type="text"
                                    placeholder="Procurar pessoas ou grupos (nome, ID ou email)"
                                    className="rounded-4 border border-3 border-secondary-subtle form-control"
                                    onChange={e => { handleSearchTextChange(e.target.value) }}
                                />
                            </div>
                            <div className="col-lg-1">
                                <ClickableIcon
                                    CIProps={{
                                        size: "38px",
                                        fill: "none",
                                        path: {
                                            d: "M33.25 33.25L23.7502 23.75M26.9167 15.8333C26.9167 21.9545 21.9545 26.9167 15.8333 26.9167C9.71218 26.9167 4.75 21.9545 4.75 15.8333C4.75 9.71218 9.71218 4.75 15.8333 4.75C21.9545 4.75 26.9167 9.71218 26.9167 15.8333Z",
                                            stroke: "black",
                                            strokeWidth: "2",
                                            strokeLineCap: "round",
                                            strokeLinejoin: "round"
                                        }
                                    }}
                                    onIconClick={handleIconClick}
                                />
                            </div>
                        </div>

                        {showList &&
                            <div className="d-flex justify-content-center mb-3" style={{ marginLeft: "15%", marginRight: "15%" }}>
                                <div className="container rounded-4 border border-3 border-secondary-subtle p-1" style={{ overflow: "overlay", maxHeight: "16.313rem" }}>
                                    {
                                        show404Text &&
                                        <div className="d-flex justify-content-center">
                                            <span className="text-center"><strong>Sem resultados</strong></span>
                                        </div>
                                    }
                                    {
                                        show400Text &&
                                        <div className="d-flex justify-content-center">
                                            <span className="text-center"><strong>Procure nomes, IDs ou e-mails!</strong></span>
                                        </div>
                                    }
                                    <div style={{ overflowX: "hidden" }} className="d-flex flex-column">
                                        {
                                            hasFetchedPeopleData &&
                                            <div className="rounded-4 d-flex justify-content-center row">
                                                <div style={{ width: "90%" }}>
                                                    <span><strong>Pessoas:</strong></span>
                                                </div>
                                                {mapPeopleItems}
                                            </div>
                                        }
                                        {
                                            hasFetchedGroupsData &&
                                            <div className="d-flex justify-content-center row">
                                                <div style={{ width: "90%" }}>
                                                    <span><strong>Grupos:</strong></span>
                                                </div>
                                                {mapGroupsItems}
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        }
                        <div className="my-2 d-flex justify-content-evenly">
                            <button
                                className="btn rounded-4"
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