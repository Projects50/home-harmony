import { useState } from "react";
import {
  Plus,
  Search,
  BookOpen,
  Star,
  Trash2,
  MoreHorizontal,
  BookMarked,
  BookCheck,
  BookX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBooksStore, Book } from "@/stores/booksStore";
import { cn } from "@/lib/utils";

const statusConfig = {
  "to-read": { label: "To Read", icon: BookMarked, color: "bg-muted text-muted-foreground" },
  reading: { label: "Reading", icon: BookOpen, color: "bg-primary/10 text-primary" },
  completed: { label: "Completed", icon: BookCheck, color: "bg-success/10 text-success" },
  abandoned: { label: "Abandoned", icon: BookX, color: "bg-destructive/10 text-destructive" },
};

export default function BooksPage() {
  const { books, addBook, updateBook, deleteBook, updateProgress } = useBooksStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  // Form state
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newTotalPages, setNewTotalPages] = useState("");
  const [newIsbn, setNewIsbn] = useState("");
  const [newNotes, setNewNotes] = useState("");

  const filteredBooks = books
    .filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === "all" || book.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Sort by status priority, then by date
      const statusOrder = { reading: 0, "to-read": 1, completed: 2, abandoned: 3 };
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  // Stats
  const readingCount = books.filter((b) => b.status === "reading").length;
  const completedCount = books.filter((b) => b.status === "completed").length;
  const totalPages = books.reduce((sum, b) => sum + (b.status === "completed" ? b.totalPages : b.currentPage), 0);

  const handleAddBook = () => {
    if (!newTitle.trim() || !newAuthor.trim()) return;

    addBook({
      title: newTitle,
      author: newAuthor,
      totalPages: parseInt(newTotalPages) || 0,
      currentPage: 0,
      isbn: newIsbn || undefined,
      status: "to-read",
      notes: newNotes || undefined,
    });

    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setNewTitle("");
    setNewAuthor("");
    setNewTotalPages("");
    setNewIsbn("");
    setNewNotes("");
    setEditingBook(null);
  };

  const renderRating = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-3 w-3",
              i < rating ? "text-warning fill-warning" : "text-muted"
            )}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <PageHeader
        title="Books"
        description="Track your reading journey"
      >
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient">
              <Plus className="h-4 w-4" />
              Add Book
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Book</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Book title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  placeholder="Author name"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pages">Total Pages</Label>
                  <Input
                    id="pages"
                    type="number"
                    placeholder="300"
                    value={newTotalPages}
                    onChange={(e) => setNewTotalPages(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="isbn">ISBN (optional)</Label>
                  <Input
                    id="isbn"
                    placeholder="978-0-13-468599-1"
                    value={newIsbn}
                    onChange={(e) => setNewIsbn(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Why you want to read this..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <Button onClick={handleAddBook} variant="gradient" className="w-full">
                Add Book
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="elevated">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{readingCount}</p>
              <p className="text-xs text-muted-foreground">Currently reading</p>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
              <BookCheck className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completedCount}</p>
              <p className="text-xs text-muted-foreground">Books completed</p>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <BookMarked className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalPages.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Pages read</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Books</SelectItem>
                <SelectItem value="reading">Reading</SelectItem>
                <SelectItem value="to-read">To Read</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="abandoned">Abandoned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Books List */}
      <div className="space-y-4">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book, index) => {
            const progress =
              book.totalPages > 0 ? (book.currentPage / book.totalPages) * 100 : 0;
            const StatusIcon = statusConfig[book.status].icon;

            return (
              <Card
                key={book.id}
                variant="elevated"
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Book cover placeholder */}
                    <div className="h-24 w-16 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
                      <BookOpen className="h-6 w-6 text-primary/50" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold line-clamp-1">{book.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            by {book.author}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge
                            variant="muted"
                            className={cn("gap-1", statusConfig[book.status].color)}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {statusConfig[book.status].label}
                          </Badge>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon-sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => updateBook(book.id, { status: "reading" })}
                              >
                                Start Reading
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  updateBook(book.id, {
                                    status: "completed",
                                    currentPage: book.totalPages,
                                    finishDate: new Date().toISOString(),
                                  })
                                }
                              >
                                Mark Complete
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => deleteBook(book.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {renderRating(book.rating)}

                      {book.status === "reading" && (
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span>
                              {book.currentPage} / {book.totalPages} pages
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Progress value={progress} className="flex-1 h-2" />
                            <Input
                              type="number"
                              min={0}
                              max={book.totalPages}
                              value={book.currentPage}
                              onChange={(e) =>
                                updateProgress(
                                  book.id,
                                  Math.min(parseInt(e.target.value) || 0, book.totalPages)
                                )
                              }
                              className="w-20 h-8 text-sm"
                            />
                          </div>
                        </div>
                      )}

                      {book.notes && (
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                          {book.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <EmptyState
            icon={BookOpen}
            title="No books found"
            description={
              searchQuery
                ? "Try adjusting your search"
                : "Start building your reading list"
            }
            action={
              <Button variant="gradient" onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4" />
                Add Book
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}
