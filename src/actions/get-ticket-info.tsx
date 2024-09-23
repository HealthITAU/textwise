"use server";

import type { Ticket } from "connectwise-rest/dist/Manage/ServiceAPI";
import { cwGet } from "~/actions/cw-get";

export const getTicketInfo = async (ticketId: number) => {
	const ticket = await cwGet<Ticket>(`/service/tickets/${ticketId}`);

	if (!ticket) throw new Error("Ticket not found.");

	return {
		id: ticket.id,
		name: ticket.contactName,
		number: ticket.contactPhoneNumber,
		companyName: ticket.company?.name,
		companyId: ticket.company?.id,
	};
};
