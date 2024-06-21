import React,{ useState, useEffect, useRef } from "react";
import { BrowserRouter as Router,Routes, Route, Link } from 'react-router-dom';
import ErrorComponent from "../modular/ErrorComponent"

/**
 * 
 * Pagina de erro 404
 * 
 * @returns 
 */
export default function Error404Page(){
    return(
        <div className="error-page-div">
            <ErrorComponent error="404" text="Não encontrado :(" />
        </div>
    );
}