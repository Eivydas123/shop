class AppError extends Error {
  myMessage: string;
  myStatusCode: number;
  myStatus: string;
  isOperational: boolean;
  constructor(myMessage: string, myStatusCode: number) {
    super(myMessage);
    this.myMessage = myMessage;
    this.myStatusCode = myStatusCode;
    this.myStatus = `${myStatusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
