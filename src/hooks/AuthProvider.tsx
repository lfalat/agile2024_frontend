import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import StatusResponse from "../types/responses/StatusResponse";
import { AxiosError } from "axios";
import UserProfile from "../types/UserProfile";
import api from "../app/api";

type IAuthContext = {
    userProfile: UserProfile | undefined;
    setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | undefined>>
};

const init: IAuthContext = {
    userProfile: undefined,
    setUserProfile: () => {}
};

const AuthContext = createContext<IAuthContext>(init);

export const AuthProvider = ({ children }: any) => {
    const [userProfile, setUserProfile] = useState<UserProfile>();

    useEffect(() => {
        if (localStorage.getItem("accessToken")) {
            api.get("User/Me")
                .then((res) => {
                    var data: UserProfile = res.data;

                    setUserProfile(data);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }, []);

    return (
        <AuthContext.Provider value={{ userProfile, setUserProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
