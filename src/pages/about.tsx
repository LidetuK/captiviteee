import { FC } from "react";

const AboutPage: FC = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">About Captivite</h1>
      <div className="prose prose-lg max-w-none">
        <p className="text-lg text-muted-foreground mb-6">
          Captivite is an AI-powered business automation platform that helps
          businesses streamline their operations and improve customer
          engagement.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-muted-foreground">
              To empower businesses with intelligent automation solutions that
              drive growth and enhance customer experiences.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
            <p className="text-muted-foreground">
              To be the leading provider of AI-powered business automation
              solutions, helping organizations worldwide achieve operational
              excellence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
