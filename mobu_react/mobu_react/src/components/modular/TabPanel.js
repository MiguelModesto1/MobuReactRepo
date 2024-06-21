import React,{ useContext } from "react";
import PersonGroupItem from "./PersonGroupItem";
import FriendContextMenu from "../optionMenus/FriendContextMenu";

/**
 * 
 * Painel de itens de amigos/grupos
 * 
 * 
 * @param display - Valor da prpriedade de display do div separador
 * @param personGroupData - Dados do grupo/pessoas
 * @param onItemClick - Callback para o clique num item no painel
 * @param selectedItem - Índice do Item selecionado
 * @param connection - Conexão SignalR
 * @param isFriends - Indica se o separador é de amigos ou de grupos
 * @param onOverItem - Callback do cursor do rato sobre um item no painel
 * @param prevRoom - ID da sala anterior
 * @param onSetPrevRoom - callback da sala anterior
 */
export default function TabPanel({ display, personGroupData, onItemClick, selectedItem, connection, isFriends, onOverItem, prevRoom, onSetPrevRoom }) { 

    var personGroupItems = personGroupData.length !== 0 ?
        personGroupData.map(item => {
            return <PersonGroupItem
                key={item.ItemId}
                selectedItem={selectedItem}
                friendGroupData={item}
                onItemClick={onItemClick}
                connection={connection}
                isFriends={isFriends}
                onOverItem={onOverItem}
                prevRoom={prevRoom}
                onSetPrevRoom={onSetPrevRoom}
            />
        })
        :
        <></>;

    return (
        <div style={{ display: display, height: "42.438rem", backgroundColor: "lightblue" }} >
            <div className="tab-panel" style={{ overflow: "auto" }}>
                {personGroupItems}
            </div>
        </div>
        
    );

    
}