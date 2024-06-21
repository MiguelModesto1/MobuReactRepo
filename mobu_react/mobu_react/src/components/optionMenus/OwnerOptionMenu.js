import React from "react";
import MenuItem from "../modular/MenuItem";

/**
 * 
 * Menu de acesso do dono da conta
 * 
 * @param owner - O ID do dono da conta
 * @param showMenu - Indica se o menu deve ser mostrado ou não
 * @param connection - Conexão SignalR
 * @param logoutCallback - Callback de logout
 * 
 * @returns
 */
export default function OwnerOptionMenu({owner, showMenu, connection, logoutCallback}){ 

    const handleClick = async (option) => {
        switch (option) {
            case "perfil":
                await connection.stop();
                window.location.assign("/person-profile?id=" + owner + "&requester=" + owner);
                break;
            case "procurar":
                await connection.stop();
                window.location.assign("/search?id=" + owner);
                break;
            case "terminar":
                logoutCallback();
                window.location.assign("/");
                break;
            case "fundar":
                await connection.stop();
                window.location.assign("/group-foundation?id=" + owner);
                break;
            default:
                await connection.stop();
                window.location.assign("/pending-requests?id=" + owner);
                break;
        
        }
    }
    return (
        <div className="menu-container" style={{ display: showMenu, position: "absolute", right:"0%" }}>
            <MenuItem text="Meu perfil" onClick={handleClick} onClickPrm="perfil" />
            <MenuItem text="Pesquisar" onClick={handleClick} onClickPrm="procurar" />
            <MenuItem text="Pedidos de amizade" onClick={handleClick} onClickPrm="pedidos" />
            <MenuItem text="Fundar grupo" onClick={handleClick} onClickPrm="fundar" />
            <MenuItem text="Terminar sessão" onClick={handleClick} onClickPrm="terminar" />
        </div>
    );
}