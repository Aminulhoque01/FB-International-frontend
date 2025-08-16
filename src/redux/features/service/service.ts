import { baseApi } from '../api/baseApi';  // Make sure you have this baseApi set up

export const serviceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createService: builder.mutation({
      query: (data) => ({
        url: '/service/create-service',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['service'],
    }),

    getAllService: builder.query({
      query: () => ({
        url: '/service/',
        method: 'GET',
      }),
      providesTags: ['service'],
    }),

    updatedService: builder.mutation({
      query: ({ id, data }) => ({
        url: `/service/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['service'],
    }),

    deleteService: builder.mutation({
      query: (id) => ({
        url: `/service/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['service'],
    }),
  }),
});

export const {
  useGetAllServiceQuery,
  useCreateServiceMutation,
  useUpdatedServiceMutation,
  useDeleteServiceMutation,
} = serviceApi;
