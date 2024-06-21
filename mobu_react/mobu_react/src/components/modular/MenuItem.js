import React, { useState } from "react";

/**
 * 
 * Item de menu
 * 
 * @param text - texto do item do menu
 * @param onClick - callback de clique no item
 * @param onClickPrm - parametro para passar à callback 
 * @returns 
 */
export default function MenuItem({ text, onClick, onClickPrm }) {

    return (
        <div onClick={e => {
            e.stopPropagation();
            onClick(onClickPrm);
        }}
            style={{ cursor: "pointer" }}
            className="px-2 py-3 bg-secondary-subtle"
        >
            {text}
        </div>
    );

}