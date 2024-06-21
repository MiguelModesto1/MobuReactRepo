import React, { useRef, useEffect, useState } from "react";

/**
 * 
 * Propriedade de um atributo de perfil de pessoa ou grupo
 * 
 * 
 * @param keyProp - Chave da propriedade do perfil
 * @param isEditing - Indica se a propriedade está em modo de edição
 * @param isBirthDate - Indica se é uma propriedade de data de nascimento
 * @param isText - Indica se é uma propriedade de texto
 * @param text - Texto da propriedade, se aplicável
 * @param onChangeText - Callback de alteração do texto
 */
export default function ProfileProperty({ keyProp, isEditing, isAvatar = null, isBirthDate = null, isText = null, text, onChangeText = null }) {

    const firstTextValue = useRef(text);

    const [hasChangedAvatar, setHasChangedAvatar] = useState(false);
    const [valueType, setValueType] = useState("");
    const [inputValue, setInputValue] = useState(firstTextValue.current);

    useEffect(() => {
        if (isEditing) {

            if (isAvatar && isAvatar !== null) {
                setValueType("file");
            }
            else if (isText && isText !== null) {
                setValueType("text");
            }
            else if (isBirthDate && isBirthDate !== null) {
                setValueType("date");
            }
            else {
                setValueType("password")
            }
        }
    }, []);

    useEffect(() => {
        
        if (isAvatar) {
            document.getElementsByClassName('avatar')[0].setAttribute('src', hasChangedAvatar ? text
                : "../../../assets/images/default_avatar.png");
        }

    }, [isAvatar]);

    /**
     * callback para a primeira mudanca do avatar
     */
    const handleAvatarChange = () => {
        setHasChangedAvatar(true)
    }

    /**
     * callback para a mudanca do valor do input
     * @param {any} value
     */
    const handleInputValueChange = (value) => {
        setInputValue(value)
    }

    return (
        <div className={`my-2 d-lg-flex justify-content-${isEditing ? "end" : "start"}`}>
            <span className="my-1 w-50 text-end">&nbsp;&nbsp;&nbsp;<strong>{keyProp + " : "}</strong></span>

            {!isEditing ?
                <span className="mx-2 my-1">{inputValue}</span>
                :
                <input
                    type={valueType}
                    value={!isAvatar ? inputValue : undefined}
                    className={`${isAvatar ? "avatar-input" : ""} mx-2 rounded-4 border border-3 border-secondary-subtle form-control`}
                    accept={isAvatar ? ".jpg,.jpeg,.png" : undefined}
                    onChange={e => {
                        if (isAvatar && isAvatar !== null) {
                            onChangeText(e.target);
                            if (!hasChangedAvatar) {
                                handleAvatarChange();
                            }
                        }
                        else {
                            onChangeText(e.target.value);
                            handleInputValueChange(e.target.value);
                        } 
                    }}
                />
            }
        </div>
    );

}