import { FC } from "react";

const IntegrationsPage: FC = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Integrations</h1>
      <div className="prose prose-lg max-w-none">
        <p className="text-lg text-muted-foreground">
          Connect your favorite tools and streamline your workflow with our
          integration hub.
        </p>
      </div>
    </div>
  );
};

export default IntegrationsPage;
