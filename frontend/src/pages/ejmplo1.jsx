import {Link} from "react-router-dom";

export default function Ejemplo1 () {
    return (
        <>
            <h2>Ejemplo 1</h2>
                <Link to = "/ejemplo2Page">
                    <button>Ir a ejemplo 2</button>
                </Link>
        </>
    )
}