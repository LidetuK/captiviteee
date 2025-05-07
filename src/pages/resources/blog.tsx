import React from "react";
import { Link } from "react-router-dom";

const BlogPage: React.FC = () => {
  // Mock blog posts data
  const blogPosts = [
    {
      id: 1,
      title: "How AI is Transforming Customer Service in 2023",
      excerpt:
        "Discover the latest AI trends that are revolutionizing how businesses interact with their customers.",
      date: "October 15, 2023",
      author: "Sarah Johnson",
      category: "AI Trends",
      image:
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80",
    },
    {
      id: 2,
      title: "The Business Case for Automation: ROI Analysis",
      excerpt:
        "A detailed look at how businesses can measure the return on investment from automation technologies.",
      date: "October 8, 2023",
      author: "Michael Chen",
      category: "Business Strategy",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    },
    {
      id: 3,
      title: "5 Ways to Improve Your Online Reputation Management",
      excerpt:
        "Practical strategies for businesses looking to enhance their online presence and customer perception.",
      date: "September 29, 2023",
      author: "Alex Rivera",
      category: "Reputation Management",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    },
    {
      id: 4,
      title: "The Future of Voice AI in Business Communications",
      excerpt:
        "Exploring how voice AI technologies are changing the landscape of business-to-customer interactions.",
      date: "September 22, 2023",
      author: "Priya Patel",
      category: "Voice Technology",
      image:
        "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=800&q=80",
    },
  ];

  return (
    <div className="container mx-auto py-12 px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Captivite Blog</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Insights, trends, and strategies for leveraging AI and automation in
          your business
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-lg overflow-hidden shadow-md"
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="text-sm text-gray-500 mb-2">
                {post.category} • {post.date}
              </div>
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">By {post.author}</div>
                <Link
                  to={`/resources/blog/${post.id}`}
                  className="text-primary font-medium hover:underline"
                >
                  Read More →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
