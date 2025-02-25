import { FC } from "react";

const AnalyticsPage: FC = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Analytics</h1>
      <div className="prose prose-lg max-w-none">
        <p className="text-lg text-muted-foreground">
          Get detailed insights into your business performance with our
          analytics tools.
        </p>
      </div>
    </div>
  );
};

export default AnalyticsPage;
