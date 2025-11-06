import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './custom-style.module.css'
import apiClient from '../../utils/axiosConfig'
import {
    validateEmail,
    validatePassword,
    validateUsername,
} from '../validator/userValidator'
import LogoV2 from '../../assets/LogoV2.png'

const LoginRegis = () => {
    const [isSignUpMode, setIsSignUpMode] = useState(false)
    const navigate = useNavigate()
    const [message, setMessage] = useState('')
    const [errors, setErrors] = useState({})
    const [successMessage, setSuccessMessage] = useState('')

    const [loginValues, setLoginValues] = useState({
        username: '',
        password: '',
        remember: false,
    })

    const [regisValues, setRegisValues] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
    })
    const handleLogin = async (e) => {
        e.preventDefault()

        try {
            const response = await apiClient.post('/api/login', {
                username: loginValues.username,
                password: loginValues.password,
                rememberMe: loginValues.remember,
            })

            setMessage(response.data.message)

            if (response.status === 200) {
                setTimeout(() => {
                    navigate('/', { replace: true })
                }, 1000)
            }
        } catch (error) {
            console.error('Login error:', error)
            setMessage(
                error.response?.data?.message ||
                    'Login failed. Please try again.'
            )
        }
    }

    const clearRegisForm = () => {
        setRegisValues({
            email: '',
            username: '',
            password: '',
            confirmPassword: '',
        })
    }
    const handleRegis = async (e) => {
        e.preventDefault()
        let validationErrors = {}

        const emailValidation = validateEmail(regisValues.email)
        if (emailValidation !== true) validationErrors.email = emailValidation

        const usernameValidation = validateUsername(regisValues.username)
        if (usernameValidation !== true)
            validationErrors.username = usernameValidation

        const passwordValidation = validatePassword(regisValues.password)
        if (passwordValidation !== true)
            validationErrors.password = passwordValidation

        if (regisValues.password !== regisValues.confirmPassword) {
            validationErrors.confirmPassword = 'Passwords do not match.'
        }

        if (Object.keys(validationErrors).length === 0) {
            try {
                const response = await apiClient.post('/api/register', {
                    email: regisValues.email,
                    username: regisValues.username,
                    password: regisValues.password,
                })

                setSuccessMessage(response.data.message)
                setErrors({})

                if (response.status === 200) {
                    setTimeout(() => {
                        setIsSignUpMode(false)
                        clearRegisForm()
                        navigate('/login', { replace: true })
                    }, 2000)
                }
            } catch (error) {
                console.error('Registration error:', error.response?.data)
                setErrors({
                    apiError:
                        error.response?.data?.message ||
                        'An error occurred. Please try again.',
                })
                setSuccessMessage('')
            }
        } else {
            setErrors(validationErrors)
            setSuccessMessage('')
        }
    }

    useEffect(() => {
        const currentPath = window.location.pathname
        if (isSignUpMode && currentPath !== '/register') {
            navigate('/register', { replace: true })
        } else if (!isSignUpMode && currentPath !== '/login') {
            navigate('/login', { replace: true })
        }
    }, [isSignUpMode, navigate])

    const handleSignUpClick = () => {
        setIsSignUpMode(true)
    }

    const handleSignInClick = () => {
        setIsSignUpMode(false)
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target

        if (isSignUpMode) {
            setRegisValues((prev) => ({ ...prev, [name]: value }))
        } else {
            setLoginValues((prev) => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value,
            }))
        }
    }

    return (
        <div
            className={`${styles.container} ${
                isSignUpMode ? styles['sign-up-mode'] : ''
            }`}
        >
            <div className={styles['forms-container']}>
                <div className={styles['signin-signup']}>
                    <form
                        className={styles['sign-in-form']}
                        onSubmit={handleLogin}
                    >
                        <img
                            src={LogoV2}
                            alt="Logo"
                            className="h-24 w-auto mb-4"
                        />
                        <h2 className={styles.title}>Login</h2>
                        <div className={styles.form}>
                            <input
                                type="text"
                                name="username"
                                value={loginValues.username}
                                onChange={handleChange}
                                required
                            />
                            <label className={styles['label-name']}>
                                <span className={styles['content-name']}>
                                    Username
                                </span>
                            </label>
                        </div>
                        <div className={styles.form}>
                            <input
                                type="password"
                                name="password"
                                value={loginValues.password}
                                onChange={handleChange}
                                autoComplete="off"
                                required
                            />
                            <label className={styles['label-name']}>
                                <span className={styles['content-name']}>
                                    Password
                                </span>
                            </label>
                        </div>
                        <div className="flex mt-4 items-center">
                            <input
                                type="checkbox"
                                id="remember"
                                name="remember"
                                className="text-blue-500"
                                checked={loginValues.remember}
                                onChange={handleChange}
                            />
                            <label
                                htmlFor="remember"
                                className="text-gray-600 ml-2"
                            >
                                Remember Me
                            </label>
                        </div>
                        <input
                            type="submit"
                            value="Login"
                            className={`${styles.btn} ${styles.solid}`}
                        />
                        {message && (
                            <p className="text-center text-green-500">
                                {message}
                            </p>
                        )}
                    </form>

                    <form
                        className={styles['sign-up-form']}
                        onSubmit={handleRegis}
                    >
                        <img
                            src={LogoV2}
                            alt="Logo"
                            className="h-24 w-auto mb-4"
                        />
                        <h2 className={styles.title}>Register</h2>
                        <div className={styles.form}>
                            <input
                                type="text"
                                name="username"
                                value={regisValues.username}
                                onChange={handleChange}
                                autoComplete="off"
                                required
                            />
                            <label className={styles['label-name']}>
                                <span className={styles['content-name']}>
                                    Username
                                </span>
                            </label>
                        </div>
                        {errors.username && (
                            <p className="text-red-500">{errors.username}</p>
                        )}
                        <div className={styles.form}>
                            <input
                                type="text"
                                name="email"
                                value={regisValues.email}
                                onChange={handleChange}
                                autoComplete="off"
                                required
                            />
                            <label className={styles['label-name']}>
                                <span className={styles['content-name']}>
                                    Email
                                </span>
                            </label>
                        </div>
                        {errors.email && (
                            <p className="text-red-500">{errors.email}</p>
                        )}
                        <div className={styles.form}>
                            <input
                                type="password"
                                name="password"
                                value={regisValues.password}
                                onChange={handleChange}
                                autoComplete="off"
                                required
                            />
                            <label className={styles['label-name']}>
                                <span className={styles['content-name']}>
                                    Password
                                </span>
                            </label>
                        </div>
                        {errors.password && (
                            <p className="text-red-500">{errors.password}</p>
                        )}
                        <div className={styles.form}>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={regisValues.confirmPassword}
                                onChange={handleChange}
                                autoComplete="off"
                                required
                            />
                            <label className={styles['label-name']}>
                                <span className={styles['content-name']}>
                                    Confirm Password
                                </span>
                            </label>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-red-500">
                                {errors.confirmPassword}
                            </p>
                        )}

                        <input
                            type="submit"
                            value="Register"
                            className={styles.btn}
                        />
                        {errors.apiError && (
                            <p className="text-red-500">{errors.apiError}</p>
                        )}
                        {successMessage && (
                            <p className="text-green-500">{successMessage}</p>
                        )}
                    </form>
                </div>
            </div>

            <div className={styles['panels-container']}>
                <div className={`${styles.panel} ${styles['left-panel']}`}>
                    <div className={styles.content}>
                        <h3>New here?</h3>
                        <p>
                            Join us to access exclusive content and tools
                            tailored just for you.
                        </p>
                        <button
                            className={`${styles.btn} ${styles.transparent}`}
                            onClick={handleSignUpClick}
                        >
                            Register
                        </button>
                    </div>
                    <img
                        src="https://raw.githubusercontent.com/sefyudem/Sliding-Sign-In-Sign-Up-Form/refs/heads/master/img/log.svg"
                        className={styles.image}
                        alt=""
                    />
                </div>

                <div className={`${styles.panel} ${styles['right-panel']}`}>
                    <div className={styles.content}>
                        <h3>Already one of us?</h3>
                        <p>
                            Login to continue exploring all the exciting
                            features you’ve come to love.
                        </p>
                        <button
                            className={`${styles.btn} ${styles.transparent}`}
                            onClick={handleSignInClick}
                        >
                            Login
                        </button>
                    </div>
                    <img
                        src="https://raw.githubusercontent.com/sefyudem/Sliding-Sign-In-Sign-Up-Form/refs/heads/master/img/register.svg"
                        className={styles.image}
                        alt=""
                    />
                </div>
            </div>
        </div>
    )
}

export default LoginRegis
