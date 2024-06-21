import React,{ useState, useEffect, useRef } from "react";
import { BrowserRouter as Router,Routes, Route, Link } from 'react-router-dom';
import ErrorComponent from "../modular/ErrorComponent"

/**
 * 
 * Pagina de erro 500
 * 
 * @returns 
 */
export default function Error403Page(){
    return(
        <div className="error-page-div">
            <ErrorComponent error="403" text="Acesso proibido :(" />
        </div>
    );
}