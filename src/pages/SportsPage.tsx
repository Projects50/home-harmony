import { useState } from "react";
import {
  Plus,
  Activity,
  Flame,
  Clock,
  MapPin,
  Target,
  TrendingUp,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useSportsStore, Activity as ActivityType } from "@/stores/sportsStore";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const activityTypes = [
  { value: "running", label: "Running", icon: "🏃" },
  { value: "cycling", label: "Cycling", icon: "🚴" },
  { value: "swimming", label: "Swimming", icon: "🏊" },
  { value: "gym", label: "Gym", icon: "🏋️" },
  { value: "yoga", label: "Yoga", icon: "🧘" },
  { value: "hiking", label: "Hiking", icon: "🥾" },
  { value: "other", label: "Other", icon: "⚡" },
];

export default function SportsPage() {
  const { activities, goals, addActivity, deleteActivity } = useSportsStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("all");

  // New activity form state
  const [newType, setNewType] = useState<ActivityType["type"]>("running");
  const [newName, setNewName] = useState("");
  const [newDuration, setNewDuration] = useState("");
  const [newDistance, setNewDistance] = useState("");
  const [newCalories, setNewCalories] = useState("");
  const [newNotes, setNewNotes] = useState("");

  const filteredActivities = activities
    .filter((a) => selectedType === "all" || a.type === selectedType)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Calculate stats
  const thisWeek = activities.filter((a) => {
    const activityDate = new Date(a.date);
    const weekAgo = new Date(Date.now() - 7 * 86400000);
    return activityDate >= weekAgo;
  });

  const totalDuration = thisWeek.reduce((sum, a) => sum + a.duration, 0);
  const totalCalories = thisWeek.reduce((sum, a) => sum + (a.calories || 0), 0);
  const totalDistance = thisWeek.reduce((sum, a) => sum + (a.distance || 0), 0);

  // Chart data - last 7 days
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(Date.now() - (6 - i) * 86400000);
    const dayActivities = activities.filter((a) => {
      const activityDate = new Date(a.date);
      return activityDate.toDateString() === date.toDateString();
    });
    return {
      date: date.toLocaleDateString("en-US", { weekday: "short" }),
      duration: dayActivities.reduce((sum, a) => sum + a.duration, 0),
      calories: dayActivities.reduce((sum, a) => sum + (a.calories || 0), 0),
    };
  });

  const handleAddActivity = () => {
    if (!newName.trim() || !newDuration) return;

    addActivity({
      type: newType,
      name: newName,
      duration: parseInt(newDuration),
      distance: newDistance ? parseFloat(newDistance) : undefined,
      calories: newCalories ? parseInt(newCalories) : undefined,
      date: new Date().toISOString(),
      notes: newNotes || undefined,
    });

    // Reset form
    setNewName("");
    setNewDuration("");
    setNewDistance("");
    setNewCalories("");
    setNewNotes("");
    setIsDialogOpen(false);
  };

  const getActivityIcon = (type: string) => {
    return activityTypes.find((t) => t.value === type)?.icon || "⚡";
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <PageHeader
        title="Sports Tracker"
        description="Track your workouts and achieve your fitness goals"
      >
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient">
              <Plus className="h-4 w-4" />
              Log Activity
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log New Activity</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Activity Type</Label>
                <Select value={newType} onValueChange={(v) => setNewType(v as ActivityType["type"])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {activityTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Activity Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Morning Run"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (min)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="45"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="distance">Distance (km)</Label>
                  <Input
                    id="distance"
                    type="number"
                    step="0.1"
                    placeholder="5.0"
                    value={newDistance}
                    onChange={(e) => setNewDistance(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="calories">Calories</Label>
                  <Input
                    id="calories"
                    type="number"
                    placeholder="350"
                    value={newCalories}
                    onChange={(e) => setNewCalories(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="How did it feel?"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  rows={2}
                />
              </div>

              <Button onClick={handleAddActivity} variant="gradient" className="w-full">
                Log Activity
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="elevated">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Activity className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{thisWeek.length}</p>
                <p className="text-xs text-muted-foreground">Workouts this week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalDuration}</p>
                <p className="text-xs text-muted-foreground">Minutes active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Flame className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalCalories}</p>
                <p className="text-xs text-muted-foreground">Calories burned</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalDistance.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Kilometers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart and Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card variant="elevated" className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Weekly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}m`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="duration"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorDuration)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-success" />
              Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {goals.map((goal) => {
              const progress = (goal.current / goal.target) * 100;
              return (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium capitalize">
                      {goal.type} {goal.metric}
                    </span>
                    <span className="text-muted-foreground">
                      {goal.current} / {goal.target}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              );
            })}
            {goals.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No goals set yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant={selectedType === "all" ? "secondary" : "outline"}
          size="sm"
          onClick={() => setSelectedType("all")}
        >
          All
        </Button>
        {activityTypes.map((type) => (
          <Button
            key={type.value}
            variant={selectedType === type.value ? "secondary" : "outline"}
            size="sm"
            onClick={() => setSelectedType(type.value)}
          >
            {type.icon} {type.label}
          </Button>
        ))}
      </div>

      {/* Activities List */}
      <div className="space-y-3">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => (
            <Card key={activity.id} className="animate-slide-up">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center text-2xl">
                    {getActivityIcon(activity.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{activity.name}</h3>
                      <Badge variant="muted" className="capitalize text-xs">
                        {activity.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(activity.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="font-semibold">{activity.duration}</p>
                      <p className="text-xs text-muted-foreground">min</p>
                    </div>
                    {activity.distance && (
                      <div className="text-center">
                        <p className="font-semibold">{activity.distance}</p>
                        <p className="text-xs text-muted-foreground">km</p>
                      </div>
                    )}
                    {activity.calories && (
                      <div className="text-center">
                        <p className="font-semibold">{activity.calories}</p>
                        <p className="text-xs text-muted-foreground">kcal</p>
                      </div>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => deleteActivity(activity.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {activity.notes && (
                  <p className="mt-3 text-sm text-muted-foreground pl-16">
                    "{activity.notes}"
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <EmptyState
            icon={Activity}
            title="No activities found"
            description="Start logging your workouts to track your progress"
            action={
              <Button variant="gradient" onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4" />
                Log Activity
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}
