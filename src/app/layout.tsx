import "~/styles/globals.css";

export const metadata = {
	title: "TextWise",
	description: "An SMS and authentication system for ConnectWise",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

import { Roboto } from "next/font/google";
import { Toaster } from "~/components/ui/sonner";
import { TooltipProvider } from "~/components/ui/tooltip";

const roboto = Roboto({
	weight: "400",
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={`${roboto.className}`}>
			<body>
				<TooltipProvider>
					<main className="flex h-screen w-screen flex-col items-center justify-center">
						{children}
					</main>
					<Toaster />
				</TooltipProvider>
			</body>
		</html>
	);
}
