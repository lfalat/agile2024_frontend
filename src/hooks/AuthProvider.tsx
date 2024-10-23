import { createContext, ReactNode, useContext, useMemo } from "react"
import LoginResponse from "../types/responses/LoginResponse";
import { useCookies } from "react-cookie";
import { AxiosError } from "axios";
import api from "../api/api";
import StatusResponse from "../types/responses/StatusResponse";

type Props = {
    children?: ReactNode;
}

type IAuthContext = {
    cookies: {[x: string]: any}
    login: (email: string, password: string) => Promise<StatusResponse>;
    logout: () => void
}

const init: IAuthContext = {
    cookies: {},
    login: async () => {return {statusCode: 0, message: ""}},
    logout: () => {}
}

const AuthContext = createContext<IAuthContext>(init);

export const AuthProvider = ( { children }: Props) => {
    const [cookies, setCookies, removeCookie] = useCookies();

    const login = async (email: string, password: string): Promise<StatusResponse> => {
        var statusResponse: StatusResponse = {statusCode: 0, message: "init"}

        await api.post('/Login', {
            Email: email,
            Password: password 
        }).then((res) => {
            if(res.status === 200) {
                const data: LoginResponse = res.data
                setCookies('user', data)
            } 

            statusResponse.statusCode = res.status
            statusResponse.message = res.data
        }).catch((er: AxiosError) => {
            console.error(er)

            statusResponse.statusCode = er.response?.status
            statusResponse.message = er.response?.data as string
        })

        return statusResponse
    };

    const logout = () => {
        removeCookie('user');
    }

    const value = useMemo(
        () => ({
            cookies,
            login,
            logout
        }),
        [cookies]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext);
}