import { useState } from "react";
import {
  Plus,
  Search,
  Lightbulb,
  Pin,
  Archive,
  Tag,
  Trash2,
  MoreHorizontal,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useIdeasStore } from "@/stores/ideasStore";
import { cn } from "@/lib/utils";

export default function IdeasPage() {
  const { ideas, addIdea, updateIdea, deleteIdea, archiveIdea, togglePin } = useIdeasStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<string | null>(null);

  // Form state
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newTags, setNewTags] = useState("");

  // Get all unique tags
  const allTags = Array.from(new Set(ideas.flatMap((i) => i.tags)));

  const filteredIdeas = ideas
    .filter((idea) => {
      const matchesSearch =
        idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesArchive = showArchived ? idea.archived : !idea.archived;
      const matchesTag = selectedTag === "all" || idea.tags.includes(selectedTag);
      return matchesSearch && matchesArchive && matchesTag;
    })
    .sort((a, b) => {
      // Pinned first, then by date
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  const handleAddIdea = () => {
    if (!newTitle.trim()) return;

    addIdea({
      title: newTitle,
      content: newContent,
      tags: newTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      attachments: [],
      archived: false,
      pinned: false,
    });

    resetForm();
    setIsDialogOpen(false);
  };

  const handleUpdateIdea = () => {
    if (!editingIdea || !newTitle.trim()) return;

    updateIdea(editingIdea, {
      title: newTitle,
      content: newContent,
      tags: newTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });

    resetForm();
    setEditingIdea(null);
  };

  const resetForm = () => {
    setNewTitle("");
    setNewContent("");
    setNewTags("");
  };

  const openEditDialog = (idea: typeof ideas[0]) => {
    setEditingIdea(idea.id);
    setNewTitle(idea.title);
    setNewContent(idea.content);
    setNewTags(idea.tags.join(", "));
    setIsDialogOpen(true);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <PageHeader
        title="Ideas"
        description="Capture and organize your thoughts"
      >
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              resetForm();
              setEditingIdea(null);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button variant="gradient">
              <Plus className="h-4 w-4" />
              New Idea
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingIdea ? "Edit Idea" : "New Idea"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Give your idea a title..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Write your idea here... (Markdown supported)"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  placeholder="product, feature, urgent"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                />
              </div>

              <Button
                onClick={editingIdea ? handleUpdateIdea : handleAddIdea}
                variant="gradient"
                className="w-full"
              >
                {editingIdea ? "Save Changes" : "Save Idea"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search ideas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant={selectedTag === "all" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setSelectedTag("all")}
              >
                All
              </Button>
              {allTags.slice(0, 5).map((tag) => (
                <Button
                  key={tag}
                  variant={selectedTag === tag ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTag(tag)}
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Button>
              ))}
            </div>
            <Button
              variant={showArchived ? "secondary" : "outline"}
              size="sm"
              onClick={() => setShowArchived(!showArchived)}
            >
              <Archive className="h-4 w-4 mr-1" />
              Archived
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Ideas Grid */}
      {filteredIdeas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIdeas.map((idea, index) => (
            <Card
              key={idea.id}
              variant="elevated"
              className={cn(
                "group cursor-pointer hover:shadow-lg transition-all duration-200 animate-slide-up",
                idea.pinned && "ring-2 ring-primary/20"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => openEditDialog(idea)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {idea.pinned && (
                      <Pin className="h-4 w-4 text-primary fill-primary" />
                    )}
                    <CardTitle className="text-base line-clamp-1">
                      {idea.title}
                    </CardTitle>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => togglePin(idea.id)}>
                        <Pin className="h-4 w-4 mr-2" />
                        {idea.pinned ? "Unpin" : "Pin"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => archiveIdea(idea.id)}>
                        <Archive className="h-4 w-4 mr-2" />
                        {idea.archived ? "Unarchive" : "Archive"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => deleteIdea(idea.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                  {idea.content.replace(/[#*_]/g, "")}
                </p>

                {idea.tags.length > 0 && (
                  <div className="flex items-center gap-1 flex-wrap mb-3">
                    {idea.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="muted" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {idea.tags.length > 3 && (
                      <Badge variant="muted" className="text-xs">
                        +{idea.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  Updated {new Date(idea.updatedAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Lightbulb}
          title={showArchived ? "No archived ideas" : "No ideas yet"}
          description={
            searchQuery
              ? "Try adjusting your search"
              : "Capture your first brilliant idea"
          }
          action={
            !showArchived && (
              <Button variant="gradient" onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4" />
                New Idea
              </Button>
            )
          }
        />
      )}
    </div>
  );
}
