export type ApiSuccess<T> = {
  success: true;
  status: "success";
  data: T;
  message?: string;
}

export type ApiError = {
  success: false;
  status: "fail" | "error";
  code?: string;
  message: string;
  issues?: unknown;// adicionar tipo 
  publicDetails?: unknown;// adicionar tipo 
  stack?: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError