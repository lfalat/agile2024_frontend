import axios from "axios";

export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const response = await axios.get("http://localhost:5091/auth/check", {
      withCredentials: true,
    });
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

export const fetchUserData = async () => {
  try {
    const response = await axios.get("http://localhost:5091/get_user");
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};
