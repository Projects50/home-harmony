import { useState } from "react";
import { Plus, Search, Receipt, TrendingUp, TrendingDown, DollarSign, PieChart, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { useExpensesStore } from "@/stores/expensesStore";

export default function ExpensesPage() {
  const { expenses, budgets, categories, addExpense, deleteExpense } = useExpensesStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAmount, setNewAmount] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const filteredExpenses = expenses
    .filter((e) => {
      const matchesSearch = e.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === "all" || e.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalThisMonth = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);

  const handleAddExpense = () => {
    if (!newAmount || !newCategory || !newDescription) return;
    addExpense({
      amount: parseFloat(newAmount),
      category: newCategory,
      description: newDescription,
      date: new Date().toISOString(),
      tags: [],
    });
    setNewAmount(""); setNewCategory(""); setNewDescription("");
    setIsDialogOpen(false);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <PageHeader title="Expenses" description="Track your spending and budgets">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient"><Plus className="h-4 w-4" />Add Expense</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Expense</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Amount</Label>
                <Input type="number" placeholder="0.00" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={newCategory} onValueChange={setNewCategory}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input placeholder="What was this for?" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
              </div>
              <Button onClick={handleAddExpense} variant="gradient" className="w-full">Add Expense</Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="elevated">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">${totalThisMonth.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">Spent this month</p>
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <PieChart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">${totalBudget.toFixed(0)}</p>
              <p className="text-xs text-muted-foreground">Total budget</p>
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
              <TrendingDown className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">${Math.max(0, totalBudget - totalThisMonth).toFixed(0)}</p>
              <p className="text-xs text-muted-foreground">Remaining</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card><CardHeader><CardTitle>Budgets</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {budgets.map((b) => (
            <div key={b.id} className="space-y-2">
              <div className="flex justify-between text-sm"><span>{b.category}</span><span>${b.spent} / ${b.limit}</span></div>
              <Progress value={(b.spent / b.limit) * 100} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card><CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </CardContent></Card>

      <div className="space-y-3">
        {filteredExpenses.length > 0 ? filteredExpenses.map((e) => (
          <Card key={e.id}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex-1">
                <p className="font-medium">{e.description}</p>
                <p className="text-sm text-muted-foreground">{new Date(e.date).toLocaleDateString()}</p>
              </div>
              <Badge variant="muted">{e.category}</Badge>
              <span className="font-semibold">${e.amount.toFixed(2)}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon-sm"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => deleteExpense(e.id)} className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>
        )) : (
          <EmptyState icon={Receipt} title="No expenses" description="Add your first expense" action={<Button variant="gradient" onClick={() => setIsDialogOpen(true)}><Plus className="h-4 w-4" />Add Expense</Button>} />
        )}
      </div>
    </div>
  );
}
