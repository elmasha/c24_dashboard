import axios from "axios";

export default axios.create({
  baseURL: "https://adengine-production-f766.up.railway.app",
  headers: {
    "Content-Type": "application/json"
  }
});