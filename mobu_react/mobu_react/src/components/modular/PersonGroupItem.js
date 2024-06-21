import React, { useEffect, useMemo, useRef, useState } from "react";
import Avatar from "./Avatar";
import TopTextBottomText from "./TopTextBottomText";

/**
 * 
 * Item de amigos ou grupos do utilizador
 * 
 * 
 * @param friendGroupData - Dados do amigo/grupo
 * @param onItemClick - Callback de clique no item
 * @param connection - Conexão SignalR
 * @param selectedItem - Índice do Item selecionado
 * @param isFriends - Indica se é item de amigo ou pessoa
 * @param onOverItem - Callback do cursor do rato sobre o item
 * @param prevRoom - ID da sala anterior
 * @param onSetPrevRoom - callback da sala anterior
 */
export default function PersonGroupItem({ friendGroupData, onItemClick, connection, selectedItem, isFriends, onOverItem, prevRoom, onSetPrevRoom }) {

    const itemId = useRef();

    useMemo(() => {
        itemId.current = friendGroupData.ItemId
    }, [friendGroupData.ItemId]);

    const lastMessage = useRef();

    useMemo(() => {
        lastMessage.current =
            isFriends ?
                friendGroupData.Messages[friendGroupData.Messages.length - 1]
                :
                friendGroupData.Mensagens[friendGroupData.Mensagens.length - 1]
    }, [friendGroupData, isFriends]);

    const roomId = useRef();

    useMemo(() => {
        roomId.current =
            isFriends ?
                friendGroupData.CommonRoomId
                :
                friendGroupData.IDSala
    }, [friendGroupData.CommonRoomId, friendGroupData.IDSala, isFriends]);

    return (
        <div
            className="d-flex py-2 px-3"
            style={{
                backgroundColor: itemId.current === selectedItem ? "#c4dcf2" : "#8ab9e5",
                cursor: "pointer"
            }}
            onMouseOver={() => onOverItem(itemId.current)}
            onClick={async () => {
                
                await connection.invoke("RemoveConnection", prevRoom + "");
                onItemClick(itemId.current);
                await connection.invoke("AddConnection", roomId.current + "");

            }}>
            <div style={{ marginTop: ".5rem" }}>
                <Avatar avatarProps={{
                    size: "2rem",
                    src: friendGroupData.ImageURL,
                    alt: isFriends ? friendGroupData.FriendName : friendGroupData.NomeSala
                }} />
            </div>
            <div style={{ marginLeft: ".5rem" }}>
                <TopTextBottomText
                    itemId={itemId.current}
                    selectedItem={selectedItem}
                    TTBTProps={{
                        top: isFriends ? friendGroupData.FriendName : friendGroupData.NomeSala,
                        bottom: lastMessage.current !== undefined ? lastMessage.current.ConteudoMsg : "Sem mensagens"
                    }}
                    fromParent=""
                />
            </div>
        </div>
    );


}