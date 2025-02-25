import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import LazyImage from "@/components/ui/image";
import BlogPost, { BlogPostType } from "./BlogPost";

const blogPosts: BlogPostType[] = [
  {
    id: 1,
    title: "How AI is Revolutionizing Customer Service in 2024",
    excerpt:
      "Discover how businesses are leveraging AI to provide 24/7 customer support and increase satisfaction rates.",
    image: "https://images.unsplash.com/photo-1531973576160-7125cd663d86",
    category: "AI & Technology",
    date: "March 15, 2024",
    readTime: "5 min read",
    author: {
      name: "Dr. Sarah Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      role: "AI Research Director",
    },
    content:
      "The landscape of customer service is undergoing a revolutionary transformation, driven by advances in artificial intelligence. In 2024, businesses are witnessing unprecedented improvements in customer satisfaction and operational efficiency through AI-powered solutions.\n\nKey Developments:\n\n1. Natural Language Processing (NLP) has evolved to understand context and sentiment with near-human accuracy, enabling more natural and empathetic customer interactions.\n\n2. Machine Learning algorithms now predict customer needs before they arise, allowing proactive support that prevents issues rather than just resolving them.\n\n3. Integration of AI with existing customer service platforms has become seamless, making adoption easier than ever for businesses of all sizes.\n\nReal-World Impact:\n\nBusinesses implementing AI-powered customer service solutions are seeing:\n- 70% reduction in response times\n- 45% increase in customer satisfaction scores\n- 30% reduction in operational costs\n\nThe future of customer service is here, and it's powered by AI.",
  },
  {
    id: 2,
    title: "The ROI of Automated Customer Communication",
    excerpt:
      "Learn how businesses are seeing 300%+ ROI with automated customer engagement systems.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    category: "Business Growth",
    date: "March 12, 2024",
    readTime: "7 min read",
    author: {
      name: "Michael Ross",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
      role: "Business Analytics Lead",
    },
    content:
      "In today's fast-paced business environment, automated customer communication isn't just a luxury—it's a necessity for survival and growth.\n\nKey Findings from Our Research:\n\n1. Cost Reduction\n- Average 65% reduction in customer service operational costs\n- 45% decrease in required support staff hours\n- 80% reduction in response time to customer inquiries\n\n2. Revenue Impact\n- 27% increase in customer retention rates\n- 35% boost in customer lifetime value\n- 42% improvement in lead conversion rates\n\n3. Customer Satisfaction\n- 89% of customers report higher satisfaction with automated responses\n- 93% appreciate the 24/7 availability\n- 78% prefer automated channels for basic inquiries\n\nImplementation Strategies:\n\n1. Start with high-volume, routine inquiries\n2. Gradually expand to more complex interactions\n3. Continuously train and refine AI models\n4. Maintain human oversight for complex cases\n\nThe data is clear: businesses that invest in automated customer communication see significant returns on their investment.",
  },
  {
    id: 3,
    title: "Building a 5-Star Online Reputation",
    excerpt:
      "Strategic approaches to managing and improving your business's online presence and reviews.",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216",
    category: "Reputation Management",
    date: "March 10, 2024",
    readTime: "6 min read",
    author: {
      name: "Emily Watson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
      role: "Digital Marketing Strategist",
    },
    content:
      "Your online reputation can make or break your business in today's digital age. Here's how to build and maintain a stellar online presence.\n\nKey Strategies:\n\n1. Proactive Review Management\n- Monitor all major review platforms\n- Respond to reviews within 24 hours\n- Address negative feedback professionally\n- Encourage satisfied customers to share experiences\n\n2. Content Strategy\n- Share authentic customer success stories\n- Regularly update your online profiles\n- Create valuable content for your audience\n- Maintain consistent branding across platforms\n\n3. Crisis Management\n- Develop a response protocol\n- Address issues promptly and transparently\n- Turn negative experiences into positive outcomes\n- Learn from feedback and implement improvements\n\nCase Study: Local Restaurant Success\nA restaurant implemented these strategies and saw:\n- Review rating increased from 3.8 to 4.7 stars\n- 40% increase in new customers\n- 25% boost in repeat business\n- 50% reduction in negative reviews\n\nYour online reputation is an invaluable asset—invest in it wisely.",
  },
];

const Blog = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPostType | null>(null);

  return (
    <section className="py-16 bg-gradient-to-br from-background via-accent/10 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Latest Insights</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Expert advice and insights on business automation and growth
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Card
              key={post.id}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedPost(post)}
            >
              <div className="aspect-w-16 aspect-h-9 relative">
                <LazyImage
                  src={post.image}
                  alt={post.title}
                  className="object-cover w-full h-48"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-sm text-primary font-medium">
                    {post.category}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {post.readTime}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {post.date}
                  </span>
                  <Button
                    variant="ghost"
                    className="text-primary hover:text-primary/90"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPost(post);
                    }}
                  >
                    Read More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg">
            View All Articles
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {selectedPost && (
          <BlogPost
            post={selectedPost}
            isOpen={!!selectedPost}
            onClose={() => setSelectedPost(null)}
          />
        )}
      </div>
    </section>
  );
};

export default Blog;
