import React, { useState, useEffect } from "react";

/**
 * Página de autores
 * @returns 
 */
export default function AuthorsPage() {
    return (
        <div>
            <p><strong>Nome:</strong> Miguel Modesto</p>
            <p><strong>Nº aluno:</strong> 23033</p>
            <p><strong>Disciplina:</strong> Desenvolvimento Web</p>
            <p><strong>Ano letivo:</strong> 2023/2024</p>
            <br />
            <p><strong>Créditos a terceiros:</strong></p>
            <p><strong>truncar texto</strong> - <a href="https://www.geeksforgeeks.org/how-to-truncate-a-string-in-javascript/">https://www.geeksforgeeks.org/how-to-truncate-a-string-in-javascript/</a></p>
            <p><strong>menu de contexto personalizado</strong> - <a href="https://www.pluralsight.com/guides/how-to-create-a-right-click-menu-using-react2">https://www.pluralsight.com/guides/how-to-create-a-right-click-menu-using-react2</a></p>
            <p><strong>barra lateral personalizada</strong> - <a href="https://www.w3schools.com/howto/howto_css_custom_scrollbar.asp">https://www.w3schools.com/howto/howto_css_custom_scrollbar.asp</a></p>
            <br />
            <p><strong>Não implementado:</strong></p>
            <p> - Capacidade de reportar</p>
        </div>
    );
}