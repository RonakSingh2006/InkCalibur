import { BACKEND_URL } from "@repo/common/config";
import axios from "axios";
export default async function checkUser(){
  const token = localStorage.getItem('token');

  if(!token) return false;

  const response = await axios.get(`${BACKEND_URL}/me`,{
    headers : {"authorization" : token}
  })

  return response.status === 200
}