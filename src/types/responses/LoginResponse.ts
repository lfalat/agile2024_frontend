type LoginResponse = {
    email: string 
    name: string
    surname: string
    token: string
    role: string
    title_After: string | null
    title_Before: string | null
}

export default LoginResponse;