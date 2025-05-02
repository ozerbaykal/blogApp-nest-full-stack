import { GetAllParams, GetAllResponse } from "../types";
import api from "./axios";

const blogService = {
  getAll: async (params: GetAllParams) => {
    const response = await api.get<GetAllResponse[]>("/posts", { params });

    return response.data;
  },
};

export default blogService;
