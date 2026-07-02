// /app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth" // Points to /auth.ts in the root
export const { GET, POST } = handlers