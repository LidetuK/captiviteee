import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const crm = {
  organizations: {
    create: async (data: any) => {
      return prisma.organization.create({
        data: {
          ...data,
          settings: {
            create: {
              preferences: {},
              aiSettings: {},
            },
          },
        },
        include: {
          settings: true,
        },
      });
    },
    get: async (id: string) => {
      return prisma.organization.findUnique({
        where: { id },
        include: {
          users: true,
          contacts: true,
          integrations: true,
          settings: true,
        },
      });
    },
  },
  integrations: {
    connect: async (
      organizationId: string,
      integrationType: string,
      config: any,
    ) => {
      return prisma.integration.create({
        data: {
          type: integrationType,
          name:
            integrationType.charAt(0).toUpperCase() + integrationType.slice(1),
          config,
          status: "active",
          organization: {
            connect: { id: organizationId },
          },
        },
      });
    },
    sync: async (integrationId: string) => {
      const integration = await prisma.integration.findUnique({
        where: { id: integrationId },
        include: { organization: true },
      });

      if (!integration) throw new Error("Integration not found");

      // Implement sync logic based on integration type
      switch (integration.type) {
        case "salesforce":
          // Implement Salesforce sync
          break;
        case "hubspot":
          // Implement HubSpot sync
          break;
        default:
          throw new Error(`Unsupported integration type: ${integration.type}`);
      }

      return prisma.integration.update({
        where: { id: integrationId },
        data: { lastSync: new Date() },
      });
    },
  },
  contacts: {
    import: async (organizationId: string, contacts: any[]) => {
      return prisma.contact.createMany({
        data: contacts.map((contact) => ({
          ...contact,
          organizationId,
        })),
      });
    },
    search: async (organizationId: string, query: string) => {
      return prisma.contact.findMany({
        where: {
          organizationId,
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
            { phone: { contains: query, mode: "insensitive" } },
          ],
        },
      });
    },
  },
};
