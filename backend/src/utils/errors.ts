type Issue = {
  field?: string;
  message: string;
  code?: string;
};

export class AppError<C extends string = string> extends Error {
  public readonly statusCode: number;
  public readonly status: "fail" | "error";
  public readonly code: C | undefined;
  public readonly issues?: Issue[] | undefined
  public readonly publicDetails?: Record<string, unknown> | undefined;
  public readonly details?: unknown;

  constructor({
    message,
    statusCode,
    code,
    issues,
    publicDetails,
    details,
  }: {
    message: string;
    statusCode: number;
    code?: C;
    issues?: Issue[];
    publicDetails?: Record<string, unknown>;
    details?: unknown;
  }) {
    super(message);

    this.statusCode = statusCode;
    this.status = String(statusCode).startsWith("4") ? "fail" : "error";
    this.issues = issues;
    this.publicDetails = publicDetails;
    this.code = code;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError<"NOT_FOUND"> {
  constructor(message = "Recurso não encontrado", details?: unknown) {
    super({ 
      message, 
      statusCode: 404, 
      code: "NOT_FOUND", 
      details 
    });
  }
}

type ValidationErrorOptions = {
  issues?: Issue[];
  details?: unknown;
  publicDetails?: Record<string, unknown>;
  message?: string;
};

export class ValidationError extends AppError<"VALIDATION_ERROR"> {
  constructor(
    options?: ValidationErrorOptions
  ){
    const { 
      issues, 
      details, 
      publicDetails, 
      message 
    } = options ?? {}

    super({
      message: message ?? "Dados inválidos",
      statusCode: 422,
      code: "VALIDATION_ERROR",
      ...(issues && { issues }),
      ...(publicDetails && { publicDetails }),
      ...(details !== undefined && { details }),
    })
  }
}

export class UnauthorizedError extends AppError<"UNAUTHORIZED"> {
  constructor(message = "Não autorizado") {
    super({ 
      message, 
      statusCode: 401, 
      code: "UNAUTHORIZED" 
    });
  }
}