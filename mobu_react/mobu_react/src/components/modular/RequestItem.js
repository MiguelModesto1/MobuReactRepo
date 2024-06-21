import React,{ useRef, useState } from "react";
import TopTextBottomText from "./TopTextBottomText";
import Button from "./Button";

/**
 * 
 * Item de amigos ou grupos do utilizador
 * 
 * @param PIProps - propriedades do item - image, text
 * @param onClick - callback de clique no item
 * @param isGroup - booleano de grupo 
 * @returns 
 */
export default function RequestItem({PIProps, onClick}){ 

    return(
        <div className="request-item">
            <TopTextBottomText TTBTProps={PIProps.text} fromParent="item"/>
            <Button text="Aceitar" fromParent="accept-req" onClick={onClick} params={[true, PIProps.info]}/>
            <Button text="Recusar" fromParent="refuse-req" onClick={onClick} params={[false, PIProps.info]}/>
        </div>
    );

    
}