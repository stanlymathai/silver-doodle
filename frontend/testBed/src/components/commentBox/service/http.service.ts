import axios from "axios";
import { IAxiosHeaders } from "./interface.service";

const timeout = 10000;
const baseURL = "http://localhost:8080/api/v1/";

const authHeader: IAxiosHeaders = {
  Authorization: sessionStorage.getItem("token"),
  refreshToken: sessionStorage.getItem("refreshToken"),
};

export default axios.create({
  timeout,
  baseURL,
  headers: {
    ...authHeader,
    "Content-type": "application/json",
  },
});
