import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { blogPosts } from "@/data/blog-posts";
import CommentSection from "@/components/blog/CommentSection";
import { Share2, Bookmark } from "lucide-react";

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(blogPosts.find((p) => p.slug === slug));

  useEffect(() => {
    // Update post when slug changes
    setPost(blogPosts.find((p) => p.slug === slug));
  }, [slug]);

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6">
          <h1 className="text-2xl font-bold">Post not found</h1>
          <p className="text-muted-foreground">
            The requested blog post could not be found.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <div className="aspect-video relative overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="object-cover w-full h-full"
          />
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="object-cover"
                />
              </Avatar>
              <div>
                <h3 className="font-semibold">{post.author.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {post.author.role}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Bookmark className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.readTime}</span>
              <span>•</span>
              <span>{post.category}</span>
            </div>

            <div className="prose prose-lg max-w-none">
              {post.content.split("\n\n").map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Related Topics</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <Button key={tag} variant="outline" size="sm">
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <CommentSection postId={post.id} />
        </div>
      </Card>
    </div>
  );
}
