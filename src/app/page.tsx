import { ComponentGrid } from "~/components/component-grid";

export type HomeProps = {
	searchParams: { id: string | undefined; screen: string | undefined };
};

export default function Home({ searchParams }: HomeProps) {
	if (
		!searchParams.id ||
		!searchParams.screen ||
		!Number.parseInt(searchParams.id)
	) {
		throw new Error("Please open this pod within a ConnectWise ticket.");
	}

	return <ComponentGrid ticketId={Number.parseInt(searchParams.id)} />;
}
