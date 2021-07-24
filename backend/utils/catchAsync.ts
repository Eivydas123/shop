import { Request, Response, NextFunction, RequestHandler } from "express";

export default (fn: Function) => {
  return (req: any, res: any, next: any): void =>
    fn(req, res, next).catch(next);
};
