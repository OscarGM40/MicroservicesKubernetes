import axios from "axios";
import { useState } from "react";

// fijate que es un objeto,no 4 argumentos,es solo uno
const useRequest = ({ url, method, body, onSuccess }) => {

    const [errors, setErrors] = useState(null);

    const doRequest = async (props={}) => {

        try {
            setErrors(null)
            const response = await axios[method](url,
                {...body, ...props});
            // si al llamar a este hook le paso una cuarta opcion ese argumento será funcion callback que resuelva en la response.data cuando quiera en ese componente.
            if (onSuccess) {
                onSuccess(response.data);
            }
            return response.data;
        } catch (err) {
            setErrors(
            <div className="alert alert-danger">
                <h4 className="">Oooppss...</h4>
                <ul className="my-0">
                    {err.response.data.errors.map(err => <li key={err.message}>{err.message}</li>)}
                </ul>
            </div>)
        }

    }

    return {
        doRequest,
        errors
    }
}

export default useRequest;