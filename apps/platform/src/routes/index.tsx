import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/")({ component: App });

function App() {
	return (
		<div>
			<header>This the header!!!!</header>
			<h1>Hello Platform!</h1>
		</div>
	);
}
