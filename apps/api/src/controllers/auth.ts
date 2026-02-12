import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma";

export const registerUser = async (c: any) => {
	const { email, password, full_name } = await c.req.json();

	if (password.length < 8) {
		return c.json({ error: "Password minimal harus 8 karakter!" }, 400);
	}

	const existingUser = await prisma.users.findUnique({
		where: { email },
	});
	if (existingUser) {
		return c.json({ error: "Email sudah terdaftar!" }, 400);
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	const user = await prisma.users.create({
		data: {
			email,
			password: hashedPassword,
			full_name,
		},
	});
	return c.json({ message: "Registrasi berhasil!", id: user.id }, 201);
};

export const loginUser = async (c: any) => {
	const { email, password } = await c.req.json();

	const user = await prisma.users.findUnique({
		where: { email },
	});
	if (!user) {
		return c.json({ error: "Email atau Password salah!" }, 401);
	}

	const isPasswordValid = await bcrypt.compare(password, user.password);
	if (!isPasswordValid) {
		return c.json({ error: "Email atau Password salah!" }, 401);
	}

	const token = jwt.sign(
		{ userId: user.id, email: user.email },
		process.env.JWT_SECRET || "default_secret_key",
		{ expiresIn: "24h" },
	);

	return c.json({ message: "Login berhasil!", token });
};

export const logoutUser = async (c: any) => {
	return c.json({ message: "Logout berhasil!" });
};
