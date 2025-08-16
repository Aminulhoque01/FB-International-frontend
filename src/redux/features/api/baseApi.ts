



import {
  createApi,
  fetchBaseQuery,
  FetchArgs,
  BaseQueryFn,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { toast } from "sonner";
import Cookies from "js-cookie";

interface ErrorResponseData {
  message: string;
}

const baseQuery = fetchBaseQuery({
  baseUrl: "https://service-kappa-seven.vercel.app/api/v1",
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
        toast.error("Please authenticate to access this resource");
        break;
      default:
        toast.error(message);
        break;
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: ["service"],
  endpoints: () => ({}),
});