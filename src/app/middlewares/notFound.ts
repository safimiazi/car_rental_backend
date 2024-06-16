import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const message = "Api not found!";
  return res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message,
    error: "",
  });
};

export default notFound;
