import { registerGlobalMiddleware } from "@tanstack/react-start";

import { sessionMiddleware } from "@/lib/auth/middleware";

// Register global middleware that applies to all server functions
// Using sessionMiddleware to fetch session once for all routes
registerGlobalMiddleware({
  middleware: [sessionMiddleware],
});
