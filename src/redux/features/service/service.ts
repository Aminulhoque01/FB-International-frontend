import { baseApi } from "../api/baseApi";



const serviceApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        createService: builder.mutation({
            query: () => (
                {
                    url: `/service/create-service`,
                    method: "POST",
                }
            ),
            invalidatesTags:['service']
        }),

        getAllService: builder.query({
            query: () => ({
                url: `/service/`,
                method: "GET",
            }),


        }),


        updatedService:builder.mutation({
            query: ({id, data}) => ({
                url: `/service/${id}`,
                method: "GET",
                body: data
            }),
            invalidatesTags:['service']
        }),

        deleteService: builder.query({
            query: (id) => ({
                url: `/service/${id}`,
                method: "GET",
                body: id
            }),
            providesTags:['service']
        }),


    }),
});

export const {
    useGetAllServiceQuery,
    useCreateServiceMutation,
 
    useDeleteServiceQuery,
    useUpdatedServiceMutation
     

} = serviceApi;
