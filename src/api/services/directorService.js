import axiosClient from "../axiosClient";

export const directorService = {
  getAll: async () => {
    const response = await axiosClient.get("/directores");
    return response.data;
  },

  create: async (nuevoDirector) => {
    const response = await axiosClient.post("/directores", nuevoDirector);
    return response.data;
  },

  update: async (id, datosActualizados) => {
    const response = await axiosClient.put(
      `/directores/${id}`,
      datosActualizados,
    );
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosClient.delete(`/directores/${id}`);
    return response.data;
  },
};
