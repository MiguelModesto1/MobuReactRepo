// https://www.pluralsight.com/guides/how-to-create-a-right-click-menu-using-react

import React, { useState, useCallback, useEffect } from "react";

/**
 * 
 * Hook para um menu de contexto personalizado
 * 
 * @returns
 */
export function useContextMenu() {
    const [xPos, setXPos] = useState("0px");
    const [yPos, setYPos] = useState("0px");
    const [showMenu, setShowMenu] = useState(false);

    const handleContextMenu = useCallback(
        (e) => {
            e.preventDefault();

            setXPos(`${e.pageX}px`);
            setYPos(`${e.pageY}px`);
            setShowMenu(true);
        },
        [setXPos, setYPos]
    );

    const handleClick = useCallback((e) => {
        showMenu && setShowMenu(false);
    }, [showMenu]);

    useEffect(() => {
        //document.getElementsByClassName("tabs-div")[0].addEventListener("click", handleClick);
        document.addEventListener("click", handleClick);

        if (document.getElementsByClassName("tabs-div").length > 0) {
            document.getElementsByClassName("tabs-div")[0].addEventListener("contextmenu", handleContextMenu);
        }
        return () => {
            //document.getElementsByClassName("tabs-div")[0].removeEventListener("click", handleClick);
            document.removeEventListener("click", handleClick);

            if (document.getElementsByClassName("tabs-div").length > 0) {
                document.getElementsByClassName("tabs-div")[0].removeEventListener("contextmenu", handleContextMenu);
            }
        };
    });

    return { xPos, yPos, showMenu, setShowMenu };
};