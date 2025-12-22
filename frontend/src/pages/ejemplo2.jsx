import {Link} from "react-router-dom";

export default function Ejemplo2 () {
    return (
        <>
            <h2>Ejemplo 2</h2>
                <Link to = "/ejemplo1Page">
                    <button>Ir a ejemplo 1</button>
                </Link>
        </>
    )
}