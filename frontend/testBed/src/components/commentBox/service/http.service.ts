import axios from "axios";

export default axios.create({
  // baseURL: "https://testapi.sc.monitalks.io/api/v1/",
  baseURL: "http://localhost:8080/api/v1/",
  headers: {
    "Content-type": "application/json",
  },
});
