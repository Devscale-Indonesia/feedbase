import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { loginUser, logoutUser, registerUser } from "./controllers/auth";
import { authMiddleware } from "./middleware/auth";

const app = new Hono();

app.post("/auth/register", registerUser);
app.post("/auth/login", loginUser);
app.post("/auth/logout", logoutUser);

console.log("ENV", process.env.TEST);

app.get("/", (c) => {
	return c.text("Hello API!");
});

app.get("/api/test-secure", authMiddleware, (c) => {
	return c.json({ message: "Login berhasil!" });
});

serve(
	{
		fetch: app.fetch,
		port: 8000,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);
