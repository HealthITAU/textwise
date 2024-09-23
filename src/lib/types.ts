export type TicketInfo = {
  id: number | undefined | null;
  name: string | undefined | null;
  number: string | undefined | null;
  companyName: string | undefined | null;
  companyId: number | undefined | null;
};

export type ContactInfo = Omit<TicketInfo, "id">;
