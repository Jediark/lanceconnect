import { corsHeaders } from "./cors.ts";

export class AppError extends Error {
  public status: number;
  public code?: string;

  constructor(message: string, status: number = 500, code?: string) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
  }
}

export function handleError(error: unknown) {
  let status = 500;
  let message = "Internal Server Error";
  let code = "INTERNAL_ERROR";

  if (error instanceof AppError) {
    status = error.status;
    message = error.message;
    code = error.code || "APP_ERROR";
  } else if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === "string") {
    message = error;
  }

  console.error(`[ERROR] status=${status} code=${code} message=${message}`, error);

  return new Response(
    JSON.stringify({
      error: {
        message,
        code,
      },
    }),
    {
      status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    },
  );
}
