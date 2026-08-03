// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";

// export interface AuthenticatedRequest extends Request {
//   user?: any;
// }

// export const authMiddleware = (
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//       return res.status(401).json({
//         success: false,
//         message: "Authorization token missing",
//       });
//     }

//     const token = authHeader.split(" ")[1];

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid token format",
//       });
//     }

//    const decoded = jwt.verify(
//   token,
//   process.env.JWT_SECRET!
// ) as any;

// console.log("Decoded JWT:", decoded);

// req.user = {
//   ...decoded,
//   _id: decoded.id,
// };

// console.log("req.user:", req.user);

// next();

//      console.log("Decoded JWT:", decoded);

//     req.user = decoded;

//     next();
//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid or expired token",
//     });
//   }
// };

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid token format",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as any;

    console.log("Decoded JWT:", decoded);

    req.user = {
      ...decoded,
      _id: decoded.id,
    };

    console.log("req.user:", req.user);

    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};