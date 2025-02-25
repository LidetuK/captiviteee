export interface Organization {
  id: string;
  name: string;
  industry?: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
  users: User[];
  contacts: Contact[];
  integrations: Integration[];
  settings?: Settings;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: "ADMIN" | "MANAGER" | "USER";
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Contact {
  id: string;
  email: string;
  name: string;
  phone?: string;
  organizationId: string;
  tags: string[];
  status?: string;
  lastContact?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Integration {
  id: string;
  type: string;
  name: string;
  config?: any;
  organizationId: string;
  status: "active" | "inactive" | "error";
  lastSync?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Settings {
  id: string;
  organizationId: string;
  preferences?: any;
  aiSettings?: any;
  createdAt: Date;
  updatedAt: Date;
}
