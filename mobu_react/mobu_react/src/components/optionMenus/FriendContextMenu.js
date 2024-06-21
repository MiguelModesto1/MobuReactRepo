import React, { useEffect, useState } from "react";
import { useContextMenu } from "../../hooks/useContextMenu";
import MenuItem from "../modular/MenuItem";

/**
 * 
 * Menu de contexto do amigo
 * 
 * @param itemId - O ID do item do separador
 * @param isFriendOverBlocked - Indica se o amigo sob o cursor do rato foi bloqueado pelo utilizador
 * @param hasFriendOverBlockedMe - Indica se o amigo sob o cursor do rato bloqueou o utilizador
 * @param owner - O ID do dono da conta
 * @param onBlock - A callback de bloqueio do amigo
 * @param id - O ID do amigo
 * @param connection - Conexão SignalR
 * 
 * @returns
 */
export default function FriendContextMenu({ itemId, isFriendOverBlocked, hasFriendOverBlockedMe, owner, onBlock, id, connection }) {

    const { xPos, yPos, showMenu, setShowMenu } = useContextMenu();

    const handleClick = async (option) => {
        switch (option) {
            case "perfil":
                await connection.stop();
                window.location.assign("/person-profile?id=" + id + "&requester=" + owner);
                break;
            default:
                if (isFriendOverBlocked) {
                    await connection.invoke("Unblock", owner + "", id + "");
                    onBlock(itemId, false);
                }
                else {
                    await connection.invoke("Block", owner + "", id + "");
                    onBlock(itemId, true);
                }
                setShowMenu(false);
                break;
                ;
        }
    }

    return (
        <>
            {showMenu ? (
                <div
                    className="menu-container d-flex flex-column col-lg-1 col-5"
                    style={{
                        top: yPos,
                        left: xPos,
                        position: "absolute"
                    }}
                >
                    <MenuItem text="Perfil" onClick={handleClick} onClickPrm="perfil" />
                    {
                        !hasFriendOverBlockedMe &&
                        <MenuItem text={isFriendOverBlocked ? "Desbloquear" : "Bloquear"} onClick={handleClick} onClickPrm="block_mngmt" />
                    }

                    {/*<MenuItem text="Reportar" onClick={handleClick} onClickPrm="reportar" />*/}
                </div>
            ) : (
                <></>
            )}
        </>
    );
}