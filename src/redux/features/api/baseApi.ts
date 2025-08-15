


import {
  createApi,
  fetchBaseQuery,
  FetchArgs,
  BaseQueryFn,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { toast } from "sonner";
import Cookies from "js-cookie";

// Define the shape of the error response from the API
interface ErrorResponseData {
  message: string;
}

// Use FetchBaseQueryError for the baseQuery error type, but handle ErrorResponseData internally
const baseQuery = fetchBaseQuery({
  baseUrl: `https://api.10minuteschool.com/discovery-service/api/v1/products/ielts-course`,
  prepareHeaders: (headers) => {
    const token = Cookies.get("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithRefreshToken: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    const { status, data } = result.error;
    // Safely access the message property with a type guard or fallback
    const message =
      typeof data === "object" && data !== null && "message" in data
        ? (data as ErrorResponseData).message
        : "An error occurred";

    switch (status) {
      case 404:
        toast.error(message || "Not Found");
        break;
      case 403:
        toast.error(message || "Forbidden");
        break;
      case 409:
        toast.error(message || "Conflict");
        break;
      case 401:
        console.log("Unauthorized:", result.error);
        // window.location.href = "/login"; // Uncomment if redirect is needed
        break;
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: ["course", "faq"],
  endpoints: () => ({}),
});