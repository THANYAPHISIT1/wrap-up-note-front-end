export const validateEmail = (email) => {
    if (!email) {
        return 'Email is required.'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        return 'Please enter a valid email address.'
    }

    return true
}

export const validateUsername = (username) => {
    if (!username) {
        return 'Username is required.'
    }

    if (username.length < 3) {
        return 'Username must be at least 3 characters long.'
    }

    if (username.length > 20) {
        return 'Username must not exceed 20 characters.'
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/
    if (!usernameRegex.test(username)) {
        return 'Username can only contain letters, numbers, and underscores.'
    }

    return true
}

export const validatePassword = (password) => {
    if (!password) {
        return 'Password is required.'
    }

    if (password.length < 8) {
        return 'Password must be at least 8 characters long.'
    }

    if (password.length > 50) {
        return 'Password must not exceed 50 characters.'
    }

    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
        return 'Password must contain at least one uppercase letter, one lowercase letter, and one number.'
    }

    return true
}
