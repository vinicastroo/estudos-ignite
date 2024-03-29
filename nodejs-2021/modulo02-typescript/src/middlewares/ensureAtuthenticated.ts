import { NextFunction, Request, Response } from "express";
import { verify } from 'jsonwebtoken'
import { AppError } from "../erros/AppError";
import { UserRepository } from '../modules/accounts/repostiories/implementacions/UserRepository'

interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token missing", 401);
  }

  const [, token] = authHeader.split(" ")

  try {
    const { sub: user_id } = verify(token, '8d107871c7d19dd1f6d0287fa1e87691') as IPayload

    const usersRepository = new UserRepository();

    const user = usersRepository.findById(user_id)

    if (!user) {
      throw new AppError("User does not exists", 401);
    }

    request.user = {
      id: user_id
    }

    next();
  } catch {
    throw new AppError("Invalid token", 401)
  }
}