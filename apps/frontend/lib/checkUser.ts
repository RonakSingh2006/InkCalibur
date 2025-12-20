import axios from "axios";
export default async function checkUser(){
  const token = localStorage.getItem('token');

  if(!token) return false;

  const response = await axios.get("/me",{
    headers : {"authorization" : token}
  })

  return response.status === 200
}