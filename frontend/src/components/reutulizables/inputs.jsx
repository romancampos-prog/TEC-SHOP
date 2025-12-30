import "./inputs.css";

//Input de texto 
export default function Input_texto ({value, onChange, placeholder = "" , type = "text", className}) {
    return (
        <>
            <input 
                type = {type}
                value = {value}
                onChange = {onChange}
                placeholder = {placeholder}
                className = {`input ${className}`}            
            />
        </>
    )
}