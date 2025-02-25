import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";

interface Comment {
  id: number;
  text: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
}

interface CommentSectionProps {
  postId: number;
  comments?: Comment[];
}

export default function CommentSection({
  postId,
  comments: initialComments = [],
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: comments.length + 1,
      text: newComment,
      author: {
        name: "Guest User",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`,
      },
      date: new Date().toLocaleDateString(),
    };

    setComments([...comments, comment]);
    setNewComment("");
  };

  return (
    <div className="mt-12 pt-8 border-t">
      <h3 className="text-2xl font-bold mb-6">Comments</h3>

      <form onSubmit={handleSubmit} className="mb-8">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="mb-4"
        />
        <Button type="submit">Post Comment</Button>
      </form>

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <Avatar className="w-10 h-10">
              <img src={comment.author.avatar} alt={comment.author.name} />
            </Avatar>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{comment.author.name}</span>
                <span className="text-sm text-muted-foreground">
                  {comment.date}
                </span>
              </div>
              <p className="text-muted-foreground">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
