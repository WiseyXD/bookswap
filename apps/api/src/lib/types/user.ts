import { JWTPayload } from "jose";

export type UserData = {
  email: string;
  name: string;
  id: string;
  image: string;
};

export interface JWTUserPayload extends JWTPayload {
  email: string;
  name: string;
  id: string;
  image: string;
  iat: number;
  exp: number;
}
