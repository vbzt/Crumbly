import { BadRequestException, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

export class ItemIdCheckMiddleware implements NestMiddleware{
  use(req: Request, res: Response, next: NextFunction) {
    if(isNaN(Number(req.params.itemId)) || Number(req.params.itemId) <= 0) throw new BadRequestException('Invalid ID')
    next()
  }
}