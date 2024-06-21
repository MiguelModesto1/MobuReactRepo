import React, { useEffect, useState, useRef } from "react";
import Avatar from "./Avatar";

/**
 * 
 * Item do resultado da pesquisa
 * 
 * @param connection - Conexão SignalR
 * @param ownerId - ID do dono da conta
 * @param personRoomId - ID da sala da pessoa ou grupo
 * @param name - Nome da pessoa ou grupo
 * @param avatar - Avatar da pessoa ou grupo
 * @param email - Email da pessoa (se não for grupo)
 * @param isGroup - Indica se é um grupo
 */
export default function PersonGroupFoundItem({ connection, ownerId, personRoomId, name, avatar, email = null, isGroup }) {

    const [changeButtonText, setChangeButtonText] = useState("");
    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {

        if (!isGroup) {
            connection.on("ReceiveRequest", (user, fromUsername) => {
                if (personRoomId + "" === user) {
                    setChangeButtonText("Pedido Enviado");
                }
            });
        }
        else {
            connection.on("ReceiveEntry", (group, message) => {
                if (personRoomId + "" === group) {
                    setChangeButtonText("Entrou");
                }
            });
        }



    }, [])

    useEffect(() => {
        setChangeButtonText(isGroup === false ? "Pedir em amizade" : "Entrar");
    }, [isGroup]);

    /**
     * parametro que avalia se o botao ja foi clicado
     */
    function handleIsClicked() {
        setIsClicked(true);
    }

    /**
     * clique no botao de pedidos
     * @returns
     */
    async function handleRequestButtonClick() {

        if (!isGroup) {
            await connection.invoke("SendRequestToUser", ownerId + "", personRoomId + "");
        } else {
            await connection.invoke("EnterGroup", ownerId + "", personRoomId + "");
        }

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
                            alt: "avatar de " + personRoomId
                        }}
                        />
                    </div>
                    <div className="col-xl-4" style={{ marginLeft: ".5rem" }}>
                        <span>{"#" + personRoomId}</span>
                        <br />
                        <span>{name}</span>
                        {!isGroup && email !== null ?
                            <>
                                <br />
                                <div className="text-wrap w-100">
                                    {email}
                                </div>
                            </>
                            :
                            <></>
                        }
                    </div>
                </div>
                <div className="d-xl-flex justify-content-end my-auto col-xl-5">
                    <button
                        className="btn rounded-4"
                        disabled={isClicked}
                        style={{ backgroundColor: "#3b9ae1", color: "white" }}
                        onClick={() => {
                            handleRequestButtonClick();
                            if (!isClicked)
                                handleIsClicked();
                        }}
                    >
                        {changeButtonText}
                    </button>
                </div>
            </div>
        </div>
        
    );

}