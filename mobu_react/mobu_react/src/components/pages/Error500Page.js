import React,{ useState, useEffect, useRef } from "react";
import { BrowserRouter as Router,Routes, Route, Link } from 'react-router-dom';
import ErrorComponent from "../modular/ErrorComponent"

/**
 * 
 * Pagina de erro 500
 * 
 * @returns 
 */
export default function Error500Page(){
    return(
        <div className="error-page-div">
            <ErrorComponent error="500" text="Erro no servidor :(" />
        </div>
    );
}