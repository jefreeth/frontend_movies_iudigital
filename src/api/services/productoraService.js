import axiosClient from "../axiosClient";

export const productoraService = {
  getAll: async () => {
    const response = await axiosClient.get("/productoras");
    return response.data;
  },

  create: async (nuevaProductora) => {
    const response = await axiosClient.post("/productoras", nuevaProductora);
    return response.data;
  },

  update: async (id, datosActualizados) => {
    const response = await axiosClient.put(
      `/productoras/${id}`,
      datosActualizados,
    );
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosClient.delete(`/productoras/${id}`);
    return response.data;
  },
};
