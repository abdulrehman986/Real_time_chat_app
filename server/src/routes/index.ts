import userRoutes from "./userRoutes"

import { Application, Request, Response, NextFunction } from "express"

const AppRoutes = (app: Application) => {
  app.use("/v0", userRoutes)


  // Handle 404
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).send("Page not found")
  })

  // Error handling middleware
  app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    console.error(error.stack)
    res.status(500).send("Application has been broke!")
  })
}

export default AppRoutes
