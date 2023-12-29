export class ApiError extends Error {
  constructor(error: { response: { data: any } }) {
    if (error?.response?.data) {
      console.error(error.response.data);
    } else {
      console.error(error);
    }

    console.error(new Error().stack);

    super("ApiError");
  }
}
