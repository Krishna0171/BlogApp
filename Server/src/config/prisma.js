import { PrismaClient } from "../../generated/prisma/client.js";
import auditMiddleware from "../../prisma/middlewares/audit.middleware.js";

const prisma = new PrismaClient();
prisma.$use(auditMiddleware);

export default prisma;
