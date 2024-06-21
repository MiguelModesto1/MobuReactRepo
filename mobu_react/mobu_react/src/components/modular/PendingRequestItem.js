import React, { useEffect, useState, useRef } from "react";
import Avatar from "./Avatar";



/**
 * 
 * Item de pedidos pendentes
 * 
 * @param connection - Conexão SignalR
 * @param ownerId - ID do dono da conta
 * @param personId - ID da pessoa solicitadora
 * @param name - Nome da pessoa solicitadora
 * @param avatar - URL do avatar da pessoa solicitadora
 */
export default function PendingRequestItem({ connection, ownerId, personId, name, avatar }) {

    const [acceptButtonText, setAcceptButtonText] = useState("");
    const [refuseButtonText, setRefuseButtonText] = useState("");
    const [isAcceptClicked, setIsAcceptClicked] = useState(false);
    const [isRefuseClicked, setIsRefuseClicked] = useState(false);

    useEffect(() => {
        setAcceptButtonText("Aceitar");
        setRefuseButtonText("Recusar");

        connection.on("ReceiveRequestReply", (replierObject, reply) => {
            if (reply) {
                replierObject.friendId === personId &&
                    setAcceptButtonText("Aceite");
            }
            else {
                replierObject.friendId === personId &&
                    setRefuseButtonText("Recusado");
            }
        });

    }, []);

    /**
     * parametro que avalia se o botao 'Aceitar' ja foi clicado
     */
    function handleIsAcceptClicked() {
        setIsAcceptClicked(true);
    }

    /**
     * parametro que avalia se o botao 'Recusar' ja foi clicado
     */
    function handleIsRefuseClicked() {
        setIsRefuseClicked(true);
    }

    /**
     * clique no botao de aceitar o pedido
     * @returns
     */
    async function handleAcceptRequestButtonClick() {

        await connection.invoke("SendRequestReply", ownerId + "", personId + "", true);
    }

    /**
     * clique no botao de aceitar o pedido
     * @returns
     */
    async function handleRefuseRequestButtonClick() {

        await connection.invoke("SendRequestReply", ownerId + "", personId + "", false);
    }

    return (
        <div style={{ width: "100%" }}>
            <div
                className={`py-2 px-3 row`}
                style={{ overflow: "auto", backgroundColor: "#8ab9e5" }}
            >
                <div className="col-xl-7 row">
                    <div className="col-xl-3 my-auto mx-2">
                        <Avatar avatarProps={{
                            size: "40px",
                            src: avatar,
                            alt: "avatar de " + personId
                        }} />
                    </div>
                    <div className="col-xl-4" style={{ marginLeft: ".5rem" }}>
                        <span>{personId}</span>
                        <br />
                        <span>{name}</span>
                    </div>
                </div>
                <div className="d-xl-flex justify-content-end my-auto col-xl-5">
                    <div className="m-2">
                        <button
                            className="btn rounded-4"
                            disabled={isAcceptClicked}
                            style={{ backgroundColor: "#3b9ae1", color: "white", display: isRefuseClicked ? "none" : "block" }}
                            onClick={() => {
                                handleAcceptRequestButtonClick();
                                if (!isAcceptClicked)
                                    handleIsAcceptClicked();
                            }}
                        >
                            {acceptButtonText}
                        </button>
                    </div>
                    <div className="m-2">
                        <button
                            className="btn rounded-4"
                            disabled={isRefuseClicked}
                            style={{ backgroundColor: "#ff5f4a", color: "white", display: isAcceptClicked ? "none" : "block" }}
                            onClick={() => {
                                handleRefuseRequestButtonClick();
                                if (!isRefuseClicked)
                                    handleIsRefuseClicked();
                            }}
                        >
                            {refuseButtonText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}