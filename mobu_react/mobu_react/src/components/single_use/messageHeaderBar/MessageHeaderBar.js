import React, { useState, useEffect, useRef, useMemo } from "react";
import TopTextBottomText from "../../modular/TopTextBottomText";
import ClickableIcon from "../../modular/ClickableIcon";
import Avatar from "../../modular/Avatar";

/**
 * 
 * Cabecalho do painel de mensagens
 * 
 * @param personGroupData - Dados do amigo/grupo
 * @param selectedFriendItem - O ID do amigo selecionado
 * @param selectedGroupItem - O ID do grupo selecionado
 * @param isFriends - Indica se o separador de amigos está ativo
 * @param onMenuIconClick - Callback do clique no ícone
 * 
 * @returns
 */
export default function MessageHeaderBar({ personGroupData, selectedFriendItem, selectedGroupItem, isFriends, onMenuIconClick }) {

    

    const roomName = useRef();

    useMemo(() => {
        roomName.current = personGroupData.length !== 0 ?
            isFriends ?
                personGroupData[selectedFriendItem].FriendName
                :
                personGroupData[selectedGroupItem].NomeSala
            :
            ""
    }, [isFriends, personGroupData, selectedFriendItem, selectedGroupItem]);

    const lastMessage = useRef();

    useMemo(() => {
        lastMessage.current =
            isFriends ?
                personGroupData[selectedFriendItem]
                    .Messages[personGroupData[selectedFriendItem].Messages.length - 1]
                :
                personGroupData[selectedGroupItem]
                    .Mensagens[personGroupData[selectedGroupItem].Mensagens.length - 1]
    }, [isFriends, personGroupData, selectedFriendItem, selectedGroupItem]);

    return (
        <nav className="navbar py-1" style={{ backgroundColor: "#3b9af1", color: "white" }}>
            <div className="container-fluid">
                <div className="d-flex">
                    {personGroupData.length !== 0 &&
                        <>
                            <div style={{ marginTop: ".5rem" }}>
                                <Avatar avatarProps={{
                                    size: "2rem",
                                    src:
                                        isFriends ?
                                            personGroupData[selectedFriendItem].ImageURL
                                            :
                                            personGroupData[selectedGroupItem].ImageURL,
                                    alt:
                                        isFriends ?
                                            personGroupData[selectedFriendItem].FriendName
                                            :
                                            personGroupData[selectedGroupItem].NomeSala
                                }} />
                            </div>

                            <div style={{ marginLeft: ".5rem" }}>
                                <TopTextBottomText
                                    TTBTProps={{
                                        top: roomName.current,
                                        bottom: lastMessage.current !== undefined ? lastMessage.current.ConteudoMsg : "Sem mensagens"
                                    }}
                                />
                            </div>
                        </>
                    }

                </div>
                <ClickableIcon
                    CIProps={{
                        size: "2.5rem",
                        fill: "none",
                        path: {
                            d: "M12 18L24 30L36 18",
                            stroke: "white",
                            strokeWidth: "10",
                            strokeLineCap: "round",
                            strokeLinejoin: "round"
                        }
                    }}
                    onIconClick={onMenuIconClick} />
            </div>
        </nav>
    );


}