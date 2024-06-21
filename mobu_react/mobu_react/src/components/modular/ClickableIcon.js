import React, { useState } from "react";

/**
 * 
 * Item clicavel generico
 * 
 * @param {*} CIProps - propriedades do ícone - size, fill, path.d, path.stroke, path.strokeLinecap, path.strokeLinejoin
 * @param {*} fromParent - texto de classe do componente pai
 * @param {*} onClick - callback de clique no ícone
 * @returns 
 */
export default function ClickableIcon({ CIProps, fromParent = null, onIconClick }) {

    return (
        <div
            onClick={e => {
                e.stopPropagation();
                onIconClick();
            }}
            className={fromParent === null ? undefined : fromParent}
            style={{ cursor: "pointer" }}
            width={CIProps.size}
            height={CIProps.size}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width={CIProps.size}
                height={CIProps.size}
                viewBox={"0 0 " + CIProps.size + " " + CIProps.size}
                fill={CIProps.fill}
            >
                <path
                    d={CIProps.path.d}
                    stroke={CIProps.path.stroke}
                    strokeWidth={CIProps.path.strokeWidth}
                    strokeLinecap={CIProps.path.strokeLinecap}
                    strokeLinejoin={CIProps.path.strokeLinejoin} />
            </ svg>
        </div>
    );


}