import React, { useMemo, useLayoutEffect, useState } from "react";

/**
 * 
 * Cabecalho de separador
 * 
 * 
 * @param tabsNumber - Número total de separadores
 * @param text - Texto a ser mostrado no cabeçalho do separador
 * @param onHeaderClick - Callback para o clique no cabeçalho do separador
 * @param personGroupData - Dados de grupo/pessoa
 * @param selectedItem - Índice do Item selecionado
 * @param connection - Conexão SignalR
 * @param isFriends - Indica se o cabeçalho é de amigos ou de grupos
 */
export default function TabHeader({ tabsNumber, text, onHeaderClick, personGroupData, selectedItem, connection, isFriends }) {

    const backgroundColor = () => {
        if (text === "Amigos") {
            return isFriends ? "#c4dcf2" : "#3b9af1";
        }
        else {
            return isFriends ? "#3b9af1" : "#c4dcf2";
        }
    }

    const isBold = () => {
        if (text === "Amigos") {
            return isFriends ? "bold" : "normal";
        }
        else {
            return isFriends ? "normal" : "bold";
        }
    }

    return (
        <div
            className={"text-center w-" + 100 / tabsNumber + "  h-100"}
            style={{
                cursor: "pointer",
                backgroundColor: backgroundColor(),
                fontWeight: isBold(),
                color: "white",
                paddingTop: "1rem",
                paddingBottom: "1rem"
            }}

            onClick={async () => {
                if (!isFriends) {
                    await connection.invoke("RemoveConnection", personGroupData.group[selectedItem.group].IDSala + "");
                    await connection.invoke("AddConnection", personGroupData.friend[selectedItem.friend].CommonRoomId + "");
                } else {
                    await connection.invoke("RemoveConnection", personGroupData.friend[selectedItem.friend].CommonRoomId + "");
                    await connection.invoke("AddConnection", personGroupData.group[selectedItem.group].IDSala + "");
                }
                onHeaderClick();

            }}>
            <span>{text}</span>
        </div>
    );


}