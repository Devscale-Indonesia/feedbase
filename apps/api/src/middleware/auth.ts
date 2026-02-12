import type { Context, Next } from "hono";
import jwt from "jsonwebtoken";

export const authMiddleware = async (c: Context, next: Next) => {
	const authHeader = c.req.header("Authorization");
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return c.json({ error: "Akses ditolak" }, 401);
	}

	const token = authHeader.split(" ")[1];

	try {
		const secret = process.env.JWT_SECRET || "default_secret_key";
		const decoded = jwt.verify(token, secret);
		c.set("jwtPayload", decoded);

		await next();
	} catch (err) {
		return c.json({ error: "Token tidak valid" }, 401);
	}
};
