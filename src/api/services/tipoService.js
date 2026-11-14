import axiosClient from "../axiosClient";

export const tipoService = {
  getAll: async () => {
    const response = await axiosClient.get("/tipos");
    return response.data;
  },

  create: async (nuevoTipo) => {
    const response = await axiosClient.post("/tipos", nuevoTipo);
    return response.data;
  },

  update: async (id, datosActualizados) => {
    const response = await axiosClient.put(`/tipos/${id}`, datosActualizados);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosClient.delete(`/tipos/${id}`);
    return response.data;
  },
};
