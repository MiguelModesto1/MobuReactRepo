import React from "react";

/**
 * 
 * Componente de erro
 * 
 * @param error - C�digo do erro HTTP
 * @param text - texto do erro 
 */
export default function ErrorComponent({error, text}){
    
    return(
        <div style={{textAlign:"center"}} className="error-div">
            <span className="error-span">{error} <br />{text}</span>
        </div>
    );
}