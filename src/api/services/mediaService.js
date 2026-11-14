import axiosClient from "../axiosClient";

export const mediaService = {
  getAll: async () => {
    const response = await axiosClient.get("/medias");
    return response.data;
  },

  create: async (nuevoMedia) => {
    const response = await axiosClient.post("/medias", nuevoMedia);
    return response.data;
  },

  update: async (id, datosActualizados) => {
    const response = await axiosClient.put(`/medias/${id}`, datosActualizados);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosClient.delete(`/medias/${id}`);
    return response.data;
  },
};
