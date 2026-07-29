import { BACKEND_URL } from "@repo/common/config";
import axios from "axios";
import { Shape } from "./types";

export async function getAllShapes(slug: string): Promise<Shape[]> {
  try {
    const response = await axios.get(`${BACKEND_URL}/shapes/${slug}`);
    return response.data.shapes;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log(err.response?.data.message);
    } else {
      console.log(err);
    }
    return [];
  }
}