import cron from "node-cron";
import prisma from "../config/prisma.js";

// Runs every 10 minutes
export function scheduleSessionCleanup(){
    cron.schedule("*/10 * * * *", async () => {
        const now = new Date();
        try {
            const deleted = await prisma.session.deleteMany({
                where: {
                    expiresAt: {
                        lt: now,
                    },
                },
            });
            
            console.log(`[CLEANUP] Deleted ${deleted.count} expired sessions at ${now.toISOString()}`);
        } catch (err) {
            console.error("Error cleaning up sessions:", err);
        }
    });
}
