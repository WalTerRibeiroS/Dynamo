export type Issue = {
  field?: string;
  message: string;
  code?: string;
};

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
  issues?: Issue[] ;
  publicDetails?: Record<string, unknown>;
  stack?: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError