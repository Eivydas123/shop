class AppError extends Error {
  constructor(
    public myMessage: string,
    public myStatusCode: number,
    public isOperational: boolean = true,
    public myStatus: string = `${myStatusCode}`.startsWith("4")
      ? "fail"
      : "error"
  ) {
    super(myMessage);
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
