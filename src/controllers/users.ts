import { NextFunction, Request, Response } from "express";
import { ExpressReqWithSession } from "../types";
import { User } from "../models/user";

const renderRegister = async (_: Request, res: Response) => {
  res.render("users/register");
};

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, username, password } = req.body;
    const registeredUser = await User.build({ email, username, password });

    req.login(registeredUser, (err) => {
      if (err) next(err);
      req.flash("success", "Welcome to Yelp Camp!");
      res.redirect("/campgrounds");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/register");
  }
};

const renderLogin = (_: Request, res: Response) => {
  res.render("users/login");
};

const login = async (req: ExpressReqWithSession, res: Response) => {
  req.flash("success", "Welcome back!");
  const redirectUrl = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

const logout = (req: Request, res: Response) => {
  req.logout();
  req.flash("success", "Goodbye!");
  res.redirect("/campgrounds");
};

export default {
  login,
  logout,
  register,
  renderRegister,
  renderLogin,
};
