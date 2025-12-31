import { User, Bell, Globe, LayoutDashboard, Shield, Database, Download, Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/PageHeader";
import { useSettingsStore } from "@/stores/settingsStore";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { settings, updateSettings, resetToDefaults } = useSettingsStore();
  const { user, logout } = useAuthStore();
  const { toast } = useToast();

  const handleExport = () => {
    const data = { settings, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `homemanager-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    updateSettings({ lastExportDate: new Date().toISOString() });
    toast({ title: "Export complete", description: "Your data has been exported." });
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <PageHeader title="Settings" description="Manage your preferences" />

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="account"><User className="h-4 w-4 mr-2 hidden sm:inline" />Account</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="h-4 w-4 mr-2 hidden sm:inline" />Notifications</TabsTrigger>
          <TabsTrigger value="dashboard"><LayoutDashboard className="h-4 w-4 mr-2 hidden sm:inline" />Dashboard</TabsTrigger>
          <TabsTrigger value="localization"><Globe className="h-4 w-4 mr-2 hidden sm:inline" />Localization</TabsTrigger>
          <TabsTrigger value="data"><Database className="h-4 w-4 mr-2 hidden sm:inline" />Data</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Account & Security</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={user?.email || ""} disabled />
              </div>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={user?.name || ""} disabled />
              </div>
              <div className="flex gap-3">
                <Button variant="outline">Change Password</Button>
                <Button variant="destructive" onClick={logout}>Logout</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" />Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div><Label>Enable Reminders</Label><p className="text-sm text-muted-foreground">Get notified about tasks</p></div>
                <Switch checked={settings.globalRemindersEnabled} onCheckedChange={(v) => updateSettings({ globalRemindersEnabled: v })} />
              </div>
              <div className="flex items-center justify-between">
                <div><Label>Email Notifications</Label></div>
                <Switch checked={settings.emailNotifications} onCheckedChange={(v) => updateSettings({ emailNotifications: v })} />
              </div>
              <div className="space-y-2">
                <Label>Default Reminder Time</Label>
                <Input type="time" value={settings.defaultReminderTime} onChange={(e) => updateSettings({ defaultReminderTime: e.target.value })} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dashboard">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><LayoutDashboard className="h-5 w-5" />Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Default Landing Page</Label>
                <Select value={settings.defaultLandingModule} onValueChange={(v: any) => updateSettings({ defaultLandingModule: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dashboard">Dashboard</SelectItem>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="ideas">Ideas</SelectItem>
                    <SelectItem value="books">Books</SelectItem>
                    <SelectItem value="expenses">Expenses</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" onClick={resetToDefaults}>Reset to Defaults</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="localization">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5" />Localization</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select value={settings.currency} onValueChange={(v) => updateSettings({ currency: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <Select value={settings.dateFormat} onValueChange={(v: any) => updateSettings({ dateFormat: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Week Starts On</Label>
                <Select value={settings.weekStartDay} onValueChange={(v: any) => updateSettings({ weekStartDay: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sunday">Sunday</SelectItem>
                    <SelectItem value="monday">Monday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Database className="h-5 w-5" />Data & Backup</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-3">
                <Button onClick={handleExport}><Download className="h-4 w-4 mr-2" />Export Data</Button>
                <Button variant="outline"><Upload className="h-4 w-4 mr-2" />Import Data</Button>
              </div>
              {settings.lastExportDate && <p className="text-sm text-muted-foreground">Last export: {new Date(settings.lastExportDate).toLocaleString()}</p>}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
