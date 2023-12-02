import { getCookie } from "../utils/cookie";
import axios from "axios";

export const userInfo = async () => {
  const params = {
    email: getCookie("email"),
  };
  const headers = {
    Authorization: "Bearer " + getCookie("access"),
  };
  const result = await axios.get("https://i9b109.p.ssafy.io:8443/member/info", {
    params,
    headers,
  });

  return result;
};
