import { FC, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";
import type { ResponseTemplate } from "@/types/reputation";
import { reputationService } from "@/lib/reputation/reputationService";
import { Badge } from "@/components/ui/badge";

interface ReviewTemplatesManagerProps {
  templates: ResponseTemplate[];
  onTemplatesChanged?: () => void;
}

type NewTemplate = Omit<ResponseTemplate, "id" | "createdAt" | "updatedAt" | "usageCount" | "successRate">;

const ReviewTemplatesManager: FC<ReviewTemplatesManagerProps> = ({
  templates = [],
  onTemplatesChanged,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newTemplate, setNewTemplate] = useState<NewTemplate>({
    name: "",
    content: "",
    category: "general",
    tags: [],
    sentiment: "neutral",
    createdBy: "current-user",
  });

  const handleAddSubmit = async () => {
    try {
      setError(null);
      await reputationService.addTemplate(newTemplate);
      setIsAdding(false);
      setNewTemplate({
        name: "",
        content: "",
        category: "general",
        tags: [],
        sentiment: "neutral",
        createdBy: "current-user",
      });
      onTemplatesChanged?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add template");
    }
  };

  const handleEditSubmit = async (id: string) => {
    try {
      setError(null);
      const template = templates.find((t) => t.id === id);
      if (!template) return;

      await reputationService.updateTemplate(id, template);
      setEditingId(null);
      onTemplatesChanged?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update template");
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      setError(null);
      await reputationService.deleteTemplate(id);
      onTemplatesChanged?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete template");
    }
  };

  const handleChange = (field: keyof NewTemplate, value: any) => {
    setNewTemplate((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditChange = (
    id: string,
    field: keyof ResponseTemplate,
    value: any,
  ) => {
    const template = templates.find((t) => t.id === id);
    if (!template) return;

    const updatedTemplate = { ...template, [field]: value };
    onTemplatesChanged?.();
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(",").map((tag) => tag.trim());
    handleChange("tags", tags);
  };

  const renderTemplateForm = (
    template: NewTemplate | ResponseTemplate,
    isEditing = false,
  ) => {
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isEditing && "id" in template) {
        handleEditChange(template.id, "name", e.target.value);
      } else {
        handleChange("name", e.target.value);
      }
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (isEditing && "id" in template) {
        handleEditChange(template.id, "content", e.target.value);
      } else {
        handleChange("content", e.target.value);
      }
    };

    const handleCategoryChange = (value: string) => {
      if (isEditing && "id" in template) {
        handleEditChange(template.id, "category", value);
      } else {
        handleChange("category", value);
      }
    };

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const tags = e.target.value.split(",").map((tag) => tag.trim());
      if (isEditing && "id" in template) {
        handleEditChange(template.id, "tags", tags);
      } else {
        handleChange("tags", tags);
      }
    };

    return (
      <div className="space-y-4">
        <div>
          <Label>Name</Label>
          <Input
            value={template.name}
            onChange={handleNameChange}
            placeholder="Template name"
          />
        </div>

        <div>
          <Label>Content</Label>
          <Textarea
            value={template.content}
            onChange={handleContentChange}
            placeholder="Template content"
            rows={4}
          />
          <p className="text-sm text-gray-500 mt-1">
            Use {"{{name}}"} to insert the customer's name
          </p>
        </div>

        <div>
          <Label>Category</Label>
          <Select
            value={template.category}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="positive">Positive</SelectItem>
              <SelectItem value="negative">Negative</SelectItem>
              <SelectItem value="neutral">Neutral</SelectItem>
              <SelectItem value="general">General</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Tags</Label>
          <Input
            value={template.tags?.join(", ") || ""}
            onChange={handleTagsChange}
            placeholder="Enter tags separated by commas"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Response Templates</h2>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
          <Plus className="h-4 w-4 mr-2" />
          Add Template
        </Button>
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>New Template</CardTitle>
            <CardDescription>
              Create a new response template
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderTemplateForm(newTemplate)}
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAdding(false);
                  setNewTemplate({
                    name: "",
                    content: "",
                    category: "general",
                    tags: [],
                    sentiment: "neutral",
                    createdBy: "current-user",
                  });
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddSubmit}
                disabled={!newTemplate.name || !newTemplate.content}
              >
                Add Template
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <CardTitle>{template.name}</CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{template.category}</Badge>
                {template.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              {editingId === template.id ? (
                <>
                  {renderTemplateForm(template, true)}
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={() => handleEditSubmit(template.id)}>
                      Save Changes
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-600">{template.content}</p>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingId(template.id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTemplate(template.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReviewTemplatesManager;
