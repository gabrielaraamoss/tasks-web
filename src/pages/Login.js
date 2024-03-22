import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { authenticate } from "../redux/slices/userSlice";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isCreatingAccount, setIsCreatingAccount] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const auth = getAuth();

    const validateEmailAndPassword = () => {
        if (!validateEmail(email)) {
            toast.error("Por favor, ingresa un correo electrónico válido.");
            return false;
        }
        if (!password) {
            toast.error("Por favor, ingresa tu contraseña.");
            return false;
        }
        if (password.length < 6) {
            toast.error("La contraseña debe tener al menos 6 caracteres.");
            return false;
        }
        return true;
    };

    const validateEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    const handleAuth = (e) => {
        e.preventDefault();
        if (!validateEmailAndPassword()) return;

        if (isCreatingAccount) {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => handleAuthSuccess(userCredential))
                .catch((error) => handleAuthError(error.code));
        } else {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => handleAuthSuccess(userCredential))
                .catch((error) => handleAuthError(error.code));
        }
    };

    const handleAuthSuccess = (userCredential) => {
        if (userCredential) {
            dispatch(authenticate({ loggedIn: true, checked: true, userId: userCredential.user.uid }));
            navigate("/home");
        }
    };

    const handleAuthError = (errorCode) => {
        switch (errorCode) {
            case "auth/invalid-email":
                toast.error("El correo electrónico no es válido.");
                break;
            case "auth/user-disabled":
                toast.error("La cuenta de usuario ha sido deshabilitada.");
                break;
            case "auth/user-not-found":
            case "auth/wrong-password":
                toast.error("Correo electrónico o contraseña incorrectos.");
                break;
            case "auth/invalid-credential":
                toast.error("Las credenciales proporcionadas no son válidas.");
                break;
            default:
                toast.error("Ocurrió un error. Por favor, inténtalo de nuevo más tarde.");
        }
    };

    const toggleMode = () => {
        setIsCreatingAccount(prevMode => !prevMode);
    };

    return (
        <div className="login-body">
            <ToastContainer />
            <div className="container">
                <h1>{!isCreatingAccount ? "¡Bienvenido!" : "Registro."}</h1>
                {!isCreatingAccount && <p>Por favor ingresa tus credenciales.</p>}
                <form onSubmit={handleAuth}>
                    <div className="input-container">
                        <p>Correo electrónico</p>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="input-container">
                        <p>Contraseña</p>
                        <div className="password-input">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <FontAwesomeIcon
                                onClick={() => setShowPassword(prevShowPassword => !prevShowPassword)}
                                className="password-toggle"
                                icon={showPassword ? faEyeSlash : faEye}
                            />
                        </div>
                    </div>
                    <div>
                        <button type="submit">
                            {isCreatingAccount ? "Crear cuenta" : "Iniciar sesión"}
                        </button>
                    </div>
                </form>
                <p>{isCreatingAccount ? "¿Ya tienes una cuenta?" : "¿No tienes una cuenta?"} <a className="crear" onClick={toggleMode}>{isCreatingAccount ? "Inicia sesión" : "Crea una cuenta"}</a></p>
            </div>
        </div>
    );
}

export default Login;
