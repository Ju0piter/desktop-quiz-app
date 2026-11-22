import "./Topbar.css"
import { useState } from "react"
import { createPortal } from "react-dom"
import { registerUser, loginUser } from "../../api/auth"
import { useAuth } from "../../context/useAuth"
import type { UserLoginResponse } from "../../types/user"

interface AuthFormData {
    email: string,
    nickname: string,
    password: string
}

type AuthMode = "login" | "register"
type AuthStatus = "inProcess" | "successfull" | "unsuccessfull"

function AuthWindow ({onClose}:{onClose: () => void}) {
    const { login } = useAuth()
    const [mode, setMode] = useState<AuthMode> ("register")
    const [status, setStatus] = useState<AuthStatus> ("inProcess")
    const [formData, setFormData] = useState<AuthFormData>({
        email: "",
        nickname: "",
        password: ""
    })

    function handleChange (e: React.ChangeEvent<HTMLInputElement>) {
        const {name, value} = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
        setStatus("inProcess")
    }

    async function handleSubmit (e: React.SubmitEvent<HTMLFormElement>){
        e.preventDefault()
        if(mode === "register") {
            const registerData = await registerUser(formData.email, formData.nickname, formData.password)
            if (registerData){
                setStatus("successfull")
                setMode("login")
            } else {setStatus("unsuccessfull")}
        } else {
            const loginData: UserLoginResponse = await loginUser(formData.email, formData.password)
            if (loginData){
                login(loginData.accessToken,loginData.user)
                onClose()
            }

        }
    }
    return (
        createPortal(
            <div className="overlay">
                <div className="auth-window card brd">
                    <button className="auth-back-button card brd" onClick={onClose}> 🔙</button>
                    <div className="change-auth">
                        <button className="change-auth-button brd card" onClick={(() => {setMode("register")})}>Регистрация</button>
                        
                        <button className="change-auth-button brd card" onClick={(() => {setMode("login")})}>Вход</button>
                    </div>
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <input 
                            className="form-input card brd"
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required 
                        />
                        {mode === "register" &&(
                            <input 
                            className="form-input card brd"
                            type="nickname"
                            name="nickname"
                            placeholder="Никнейм"
                            value={formData.nickname}
                            onChange={handleChange}
                            required 
                        />
                        )}
                        <input 
                            className="form-input card brd"
                            type="password"
                            name="password"
                            placeholder="Пароль"
                            value={formData.password}
                            onChange={handleChange}
                            minLength={8}
                            required 
                        />
                        <button type="submit" className="button-submit  card brd">
                            {mode === "register"? "Зарегистрироваться" : "Войти"}
                        </button>
                        {status === "successfull" && (
                            <h4>Успешная регистрация!</h4>
                        )}
                    </form>
                </div>
            </div>,document.body
        )
    )
}

export default function Topbar () {
    const { user, logout } = useAuth()
    const [isAuthOpen, setIsAuthOpen] = useState(false)
    const [isUserOpen, setIsUserOpen] = useState(false)

    return(
        <div className="topbar">
            <div className="topbar-logo"></div>
            <h1 className="topbar-name">quizzi.club</h1>
            <div className="topbar-user">
                {user? (
                    <div className="user-info">
                        <div className="user" onClick={(()=> (setIsUserOpen(true)))}>
                            {user.nickname}    
                        </div>

                        <div className={`user-info-card ${isUserOpen? "user-open": ""}`}>
                            <div className="user-email">{`email: ${user.email}`}</div>
                            <button className="button-logout" onClick={(()=> {
                                logout()
                                setIsUserOpen(false)
                                })}>
                                Выход
                            </button>
                            <button className="button-close brd card" onClick={(()=> (setIsUserOpen(false)))}>↑ Свернуть</button>
                        </div>

                    </div>

                ): (
                    <div className="link-auth brd" onClick={(() => {setIsAuthOpen(true)})}>
                        Регистрация / Вход
                    </div>
                )}
            </div>
            {isAuthOpen && <AuthWindow onClose={(() => {setIsAuthOpen(false)})} />}
        </div>
    )
}