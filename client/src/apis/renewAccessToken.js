import { getCookie } from "../utils/cookie";
import axios from "axios";

export const renewAccessToken = async () => {
  const email = getCookie("email");
  const accessToken = getCookie("access");
  const refreshToken = getCookie("refresh");
  const headers = {
    Authorization: "Bearer " + getCookie("access"),
  };
  const result = await axios.post(
    "https://i9b109.p.ssafy.io:8443/member/reissue",
    { headers },
    {
      email,
      accessToken,
      refreshToken,
    }
  );

  return result;
};
