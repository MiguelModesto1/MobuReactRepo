import React, { useRef, useMemo, useEffect } from "react";
import Avatar from "../../modular/Avatar";

/**
 * 
 * Painel de mensagens
 * 
 * @param ownerId - O ID do dono da conta
 * @param friendGroupData - Dados do amigo/grupo
 * @param selectedFriendItem - O ID do amigo selecionado
 * @param selectedGroupItem - O ID do grupo selecionado
 * @param isFriends - Indica se o separador de amigos está ativo
 * 
 * @returns
 */
export default function MessagePanel({ ownerId, friendGroupData, selectedFriendItem, selectedGroupItem, isFriends }) {
    
    const messages = useRef(
        [{
            IDMensagem: 0,
            IDRemetente: 0,
            NomeRemetente: "",
            URLImagemRemetente: "",
            ConteudoMsg: ""
        }]
    );

    useMemo(() => {
        messages.current = friendGroupData.length !== 0 ?
            isFriends ?
                friendGroupData[selectedFriendItem].Messages
                :
                friendGroupData[selectedGroupItem].Mensagens
            :
            [{
                IDMensagem: 0,
                IDRemetente: 0,
                NomeRemetente: "",
                URLImagemRemetente: "",
                ConteudoMsg: ""
            }]
    }, [friendGroupData, isFriends, selectedFriendItem, selectedGroupItem]);

    const transformTextIntoJsx = (value) => {
        
        var jsxParagraphs = [];
        var paragraphText = "";

        for (var i = 0; i < value.length; i++) {

            if (i === value.length - 1) {
                paragraphText += value[i];
                jsxParagraphs.push(paragraphText)
                break;
            }

            if (value[i] === "\n") {
                jsxParagraphs.push(paragraphText)
                paragraphText = "";
                continue;
            }
            paragraphText += value[i];
        }
        
        return jsxParagraphs.map(paragraph => {
            return (
                <p className="text-break m-0">{paragraph}</p>
            );
        });
    }

    const containers =
        messages.current.map(
            message => {

                return (
                    <div
                        key={message.IDMensagem}
                        className={message.IDRemetente === ownerId ?
                            "d-flex justify-content-end py-1 my-3" : "d-flex justify-content-start py-1 my-3"
                        }
                    >
                        <Avatar avatarProps={{
                            size: "40px",
                            src: message.URLImagemRemetente,
                            alt: message.NomeRemetente
                        }} />

                        <div style={{ marginLeft: "1rem", marginTop: "2rem", maxWidth: "50%" }}>
                            <div className="text-primary">
                                <span><strong>{message.NomeRemetente}</strong></span>
                            </div>
                            <div
                                className="container-fluid rounded-4 py-1"
                                style={{
                                    backgroundColor: message.IDRemetente === ownerId ? "#3b9ae1" : "#8ab9e5",
                                    color: "white"
                                }}
                            >
                                {transformTextIntoJsx(message.ConteudoMsg)}
                            </div>
                        </div>
                    </div>
                );

            }
        );

    return (
        <div className="px-5 pt-3" style={{ height: "37rem", overflow: "auto" }}>
            {containers}
        </div>
    );


}