import { FC } from "react";

const DocsPage: FC = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Documentation</h1>
      <div className="prose prose-lg max-w-none">
        <p className="text-lg text-muted-foreground">
          Learn how to use and integrate Captivite's features with our
          comprehensive documentation.
        </p>
      </div>
    </div>
  );
};

export default DocsPage;
