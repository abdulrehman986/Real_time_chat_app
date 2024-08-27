import { NextFunction, Request, Response } from 'express';

export default function ValidateAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // logger.info(`User ${JSON.stringify(req.session)} is authorized to access this route.`);

  if (!req.session.userId) {
    // Clear the session
    req.session.destroy((err) => {
      if (err) {
        console.error(`Error logging out user: ${err}`);
        return res.status(500).json({ message: 'Server Error' });
      }
      // res.status(200).json({ message: 'User logged out successfully' });
    });

    return res.status(401).json({
      message: 'Unauthorized Request, please login first then try again.',
    });
  }

  next();
}
