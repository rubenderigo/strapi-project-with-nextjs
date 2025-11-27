import { loginUserAction, registerUserAction, signOutAction } from "./auth";

export const actions = {
  auth: {
    registerUserAction,
    loginUserAction,
    signOutAction,
  }
}