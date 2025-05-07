import { FC, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Code, Copy, Check } from "lucide-react";

interface IntegrationExamplesProps {
  onConnect?: (platform: string) => void;
}

const IntegrationExamples: FC<IntegrationExamplesProps> = ({ onConnect }) => {
  const [activeTab, setActiveTab] = useState("platforms");
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const handleCopyCode = (snippetId: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(snippetId);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const handleConnect = (platform: string) => {
    if (onConnect) {
      onConnect(platform);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Integration Examples
        </h2>
        <p className="text-muted-foreground">
          Connect your reputation management system with popular platforms and
          services
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-none lg:flex">
          <TabsTrigger value="platforms">Review Platforms</TabsTrigger>
          <TabsTrigger value="api">API Integration</TabsTrigger>
          <TabsTrigger value="widgets">Embed Widgets</TabsTrigger>
        </TabsList>

        <TabsContent value="platforms" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Google Business Profile */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">
                    Google Business Profile
                  </CardTitle>
                  <Badge variant="outline">Popular</Badge>
                </div>
                <CardDescription>
                  Sync reviews from your Google Business Profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">Automatic review sync</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">Response publishing</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">Rating analytics</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => handleConnect("google")}
                >
                  Connect Google
                </Button>
              </CardFooter>
            </Card>

            {/* Yelp */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Yelp</CardTitle>
                <CardDescription>
                  Import and manage your Yelp business reviews
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">Daily review sync</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">Response drafting</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">Competitor tracking</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => handleConnect("yelp")}
                >
                  Connect Yelp
                </Button>
              </CardFooter>
            </Card>

            {/* Trustpilot */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Trustpilot</CardTitle>
                <CardDescription>
                  Manage your Trustpilot reviews and ratings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">API integration</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">Automated responses</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">Sentiment analysis</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => handleConnect("trustpilot")}
                >
                  Connect Trustpilot
                </Button>
              </CardFooter>
            </Card>

            {/* Facebook */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Facebook</CardTitle>
                <CardDescription>
                  Import reviews from your Facebook business page
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">Page reviews sync</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">Comment management</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">Recommendation tracking</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => handleConnect("facebook")}
                >
                  Connect Facebook
                </Button>
              </CardFooter>
            </Card>

            {/* App Store */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">App Store</CardTitle>
                <CardDescription>
                  Track and respond to iOS app reviews
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">App Store Connect API</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">Version tracking</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">Feature request analysis</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => handleConnect("app_store")}
                >
                  Connect App Store
                </Button>
              </CardFooter>
            </Card>

            {/* Google Play Store */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Google Play Store</CardTitle>
                <CardDescription>
                  Manage Android app reviews and ratings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">Play Console integration</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">Reply management</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">Bug tracking</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => handleConnect("play_store")}
                >
                  Connect Play Store
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="api" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>REST API Integration</CardTitle>
                <CardDescription>
                  Use our REST API to integrate with your custom systems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-md relative">
                    <div className="absolute top-2 right-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleCopyCode(
                            "rest-api",
                            `fetch('https://api.captivite.com/v1/reviews', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`,
                          )
                        }
                      >
                        {copiedSnippet === "rest-api" ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <pre className="text-xs overflow-x-auto">
                      {`fetch('https://api.captivite.com/v1/reviews', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`}
                    </pre>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <Code className="h-4 w-4 mr-2" />
                      View Documentation
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Get API Key
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Webhook Integration</CardTitle>
                <CardDescription>
                  Receive real-time notifications for new reviews and events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-md relative">
                    <div className="absolute top-2 right-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleCopyCode(
                            "webhook",
                            `// Example webhook handler in Express.js
app.post('/webhook/reviews', (req, res) => {
  const { event, data } = req.body;
  
  if (event === 'review.created') {
    // Handle new review
    console.log('New review:', data);
  } else if (event === 'review.responded') {
    // Handle review response
    console.log('Review response:', data);
  }
  
  res.status(200).send('Webhook received');
});`,
                          )
                        }
                      >
                        {copiedSnippet === "webhook" ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <pre className="text-xs overflow-x-auto">
                      {`// Example webhook handler in Express.js
app.post('/webhook/reviews', (req, res) => {
  const { event, data } = req.body;
  
  if (event === 'review.created') {
    // Handle new review
    console.log('New review:', data);
  } else if (event === 'review.responded') {
    // Handle review response
    console.log('Review response:', data);
  }
  
  res.status(200).send('Webhook received');
});`}
                    </pre>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <Code className="h-4 w-4 mr-2" />
                      View Events
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Configure Webhooks
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>SDK Integration</CardTitle>
                <CardDescription>
                  Use our JavaScript SDK to integrate reputation management into
                  your applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-md relative">
                    <div className="absolute top-2 right-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleCopyCode(
                            "sdk",
                            `// Install: npm install captivite-reputation-sdk

import { CaptiviteReputation } from 'captivite-reputation-sdk';

// Initialize the SDK
const reputation = new CaptiviteReputation({
  apiKey: 'YOUR_API_KEY',
  environment: 'production'
});

// Get all reviews
reputation.reviews.getAll()
  .then(reviews => {
    console.log('Reviews:', reviews);
  })
  .catch(error => {
    console.error('Error fetching reviews:', error);
  });

// Create a response to a review
reputation.reviews.respond({
  reviewId: 'review_123',
  content: 'Thank you for your feedback!',
  status: 'published'
})
  .then(response => {
    console.log('Response created:', response);
  })
  .catch(error => {
    console.error('Error creating response:', error);
  });`,
                          )
                        }
                      >
                        {copiedSnippet === "sdk" ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <pre className="text-xs overflow-x-auto">
                      {`// Install: npm install captivite-reputation-sdk

import { CaptiviteReputation } from 'captivite-reputation-sdk';

// Initialize the SDK
const reputation = new CaptiviteReputation({
  apiKey: 'YOUR_API_KEY',
  environment: 'production'
});

// Get all reviews
reputation.reviews.getAll()
  .then(reviews => {
    console.log('Reviews:', reviews);
  })
  .catch(error => {
    console.error('Error fetching reviews:', error);
  });

// Create a response to a review
reputation.reviews.respond({
  reviewId: 'review_123',
  content: 'Thank you for your feedback!',
  status: 'published'
})
  .then(response => {
    console.log('Response created:', response);
  })
  .catch(error => {
    console.error('Error creating response:', error);
  });`}
                    </pre>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <Code className="h-4 w-4 mr-2" />
                      SDK Documentation
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Examples
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="widgets" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Review Widget</CardTitle>
                <CardDescription>
                  Display your best reviews on your website
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-md p-4 bg-card">
                    <div className="flex flex-col space-y-4">
                      <div className="p-4 bg-background rounded-md shadow-sm">
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 rounded-full bg-primary/20 mr-2"></div>
                          <div>
                            <div className="font-medium">John Smith</div>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <div key={star} className="text-yellow-400">
                                  ★
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm">
                          "Excellent service! The team was responsive and
                          professional."
                        </p>
                      </div>

                      <div className="p-4 bg-background rounded-md shadow-sm">
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 rounded-full bg-primary/20 mr-2"></div>
                          <div>
                            <div className="font-medium">Sarah Johnson</div>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <div key={star} className="text-yellow-400">
                                  ★
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm">
                          "I'm very impressed with the quality and attention to
                          detail."
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-muted rounded-md relative">
                    <div className="absolute top-2 right-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleCopyCode(
                            "widget",
                            `<script src="https://cdn.captivite.com/widgets/reviews.js" 
  data-api-key="YOUR_API_KEY"
  data-theme="light"
  data-count="5"
  data-min-rating="4">
</script>

<div id="captivite-reviews-widget"></div>`,
                          )
                        }
                      >
                        {copiedSnippet === "widget" ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <pre className="text-xs overflow-x-auto">
                      {`<script src="https://cdn.captivite.com/widgets/reviews.js" 
  data-api-key="YOUR_API_KEY"
  data-theme="light"
  data-count="5"
  data-min-rating="4">
</script>

<div id="captivite-reviews-widget"></div>`}
                    </pre>
                  </div>

                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Customize Widget
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rating Badge</CardTitle>
                <CardDescription>
                  Show off your average rating with a customizable badge
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-center p-4">
                    <div className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md shadow-sm">
                      <div className="mr-2 font-bold text-lg">4.8</div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <div key={star} className="text-yellow-400">
                            ★
                          </div>
                        ))}
                      </div>
                      <div className="ml-2 text-sm">256 reviews</div>
                    </div>
                  </div>

                  <div className="p-4 bg-muted rounded-md relative">
                    <div className="absolute top-2 right-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleCopyCode(
                            "badge",
                            `<script src="https://cdn.captivite.com/widgets/badge.js" 
  data-api-key="YOUR_API_KEY"
  data-style="modern"
  data-color="#4f46e5">
</script>

<div id="captivite-rating-badge"></div>`,
                          )
                        }
                      >
                        {copiedSnippet === "badge" ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <pre className="text-xs overflow-x-auto">
                      {`<script src="https://cdn.captivite.com/widgets/badge.js" 
  data-api-key="YOUR_API_KEY"
  data-style="modern"
  data-color="#4f46e5">
</script>

<div id="captivite-rating-badge"></div>`}
                    </pre>
                  </div>

                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Customize Badge
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Review Collection Form</CardTitle>
                <CardDescription>
                  Embed a form to collect reviews directly on your website
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-md p-4 bg-card">
                    <div className="space-y-4">
                      <div className="text-center">
                        <h3 className="font-medium">Leave a Review</h3>
                        <p className="text-sm text-muted-foreground">
                          Tell us about your experience
                        </p>
                      </div>

                      <div className="flex justify-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <div
                            key={star}
                            className="text-2xl text-yellow-400 cursor-pointer"
                          >
                            ★
                          </div>
                        ))}
                      </div>

                      <div className="h-20 border rounded-md bg-background"></div>

                      <Button className="w-full" disabled>
                        Submit Review
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-muted rounded-md relative">
                    <div className="absolute top-2 right-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleCopyCode(
                            "form",
                            `<script src="https://cdn.captivite.com/widgets/review-form.js" 
  data-api-key="YOUR_API_KEY"
  data-redirect="https://example.com/thank-you"
  data-source-id="your_source_id">
</script>

<div id="captivite-review-form"></div>`,
                          )
                        }
                      >
                        {copiedSnippet === "form" ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <pre className="text-xs overflow-x-auto">
                      {`<script src="https://cdn.captivite.com/widgets/review-form.js" 
  data-api-key="YOUR_API_KEY"
  data-redirect="https://example.com/thank-you"
  data-source-id="your_source_id">
</script>

<div id="captivite-review-form"></div>`}
                    </pre>
                  </div>

                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Customize Form
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rich Snippets</CardTitle>
                <CardDescription>
                  Add structured data to your website for better SEO
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-md relative">
                    <div className="absolute top-2 right-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleCopyCode(
                            "schema",
                            `<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "LocalBusiness",
  "name": "Your Business Name",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Main St",
    "addressLocality": "Anytown",
    "addressRegion": "CA",
    "postalCode": "12345",
    "addressCountry": "US"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "256",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {
      "@type": "Review",
      "author": "John Smith",
      "datePublished": "2023-05-15",
      "reviewBody": "Excellent service! The team was responsive and professional.",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5",
        "worstRating": "1"
      }
    }
  ]
}
</script>`,
                          )
                        }
                      >
                        {copiedSnippet === "schema" ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <pre className="text-xs overflow-x-auto">
                      {`<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "LocalBusiness",
  "name": "Your Business Name",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Main St",
    "addressLocality": "Anytown",
    "addressRegion": "CA",
    "postalCode": "12345",
    "addressCountry": "US"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "256",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {
      "@type": "Review",
      "author": "John Smith",
      "datePublished": "2023-05-15",
      "reviewBody": "Excellent service! The team was responsive and professional.",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5",
        "worstRating": "1"
      }
    }
  ]
}
</script>`}
                    </pre>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <Code className="h-4 w-4 mr-2" />
                      Schema Documentation
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Generate Schema
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegrationExamples;
