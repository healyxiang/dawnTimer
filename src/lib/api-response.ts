import { NextResponse } from "next/server";

export type ApiResponse<T = unknown> = {
  code: number;
  message: string;
  data: T | null;
  status: "success" | "error";
};

export const ApiResponseStatus = {
  SUCCESS: "success",
  ERROR: "error",
} as const;

export const ApiResponseCode = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
} as const;

export function successResponse<T>(
  data: T,
  message = "Success"
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    code: ApiResponseCode.SUCCESS,
    message,
    data,
    status: ApiResponseStatus.SUCCESS,
  });
}

export function errorResponse<T = unknown>(
  message: string,
  code: number = ApiResponseCode.INTERNAL_ERROR,
  data: T | null = null
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      code,
      message,
      data,
      status: ApiResponseStatus.ERROR,
    },
    { status: code }
  );
}

// 常用错误响应
export const apiResponses = {
  unauthorized: () =>
    errorResponse("Unauthorized", ApiResponseCode.UNAUTHORIZED),
  forbidden: () => errorResponse("Forbidden", ApiResponseCode.FORBIDDEN),
  notFound: (message = "Resource not found") =>
    errorResponse(message, ApiResponseCode.NOT_FOUND),
  badRequest: (message = "Bad request") =>
    errorResponse(message, ApiResponseCode.BAD_REQUEST),
  internalError: (message = "Internal server error") =>
    errorResponse(message, ApiResponseCode.INTERNAL_ERROR),
};
