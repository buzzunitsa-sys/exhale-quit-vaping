import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppStore } from '@/lib/store';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { LogOut, Save, User as UserIcon, Palette, Download, RefreshCw, Beaker, Zap } from 'lucide-react';
import type { User } from '@shared/types';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { PageHeader } from '@/components/ui/page-header';
const profileSchema = z.object({
  quitDate: z.string().min(1, "Quit date is required"),
  costPerUnit: z.coerce.number().min(0.01, "Cost must be greater than 0"),
  unitsPerWeek: z.coerce.number().min(0.1, "Usage must be greater than 0"),
  puffsPerUnit: z.coerce.number().min(1, "Puffs per unit must be at least 1").default(200),
  dailyLimit: z.coerce.number().min(0, "Limit cannot be negative").optional(),
  currency: z.string().default("USD"),
  nicotineStrength: z.coerce.number().min(0, "Strength must be positive").default(50),
  volumePerUnit: z.coerce.number().min(0.1, "Volume must be positive").default(1.0),
});
type ProfileForm = z.infer<typeof profileSchema>;
export function ProfilePage() {
  const user = useAppStore(s => s.user);
  const setUser = useAppStore(s => s.setUser);
  const updateProfile = useAppStore(s => s.updateProfile);
  const logout = useAppStore(s => s.logout);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema) as any,
    defaultValues: {
      quitDate: user?.profile?.quitDate || new Date().toISOString().slice(0, 16),
      costPerUnit: user?.profile?.costPerUnit || 0,
      unitsPerWeek: user?.profile?.unitsPerWeek || 0,
      puffsPerUnit: user?.profile?.puffsPerUnit || 200,
      dailyLimit: user?.profile?.dailyLimit || 0,
      currency: user?.profile?.currency || 'USD',
      nicotineStrength: user?.profile?.nicotineStrength || 50,
      volumePerUnit: user?.profile?.volumePerUnit || 1.0,
    }
  });
  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success("Logged out successfully");
  };
  const onSubmit = async (data: ProfileForm) => {
    if (!user) return;
    try {
      const updatedUser = await api<User>(`/api/user/${user.id}/profile`, {
        method: 'POST',
        body: JSON.stringify({ profile: data }),
      });
      setUser(updatedUser);
      if (updatedUser.profile) {
        updateProfile(updatedUser.profile);
      }
      toast.success("Settings updated successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update settings");
    }
  };
  const handleExport = () => {
    if (!user) return;
    try {
      const dataStr = JSON.stringify(user, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = `exhale-data-${new Date().toISOString().slice(0, 10)}.json`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      toast.success("Data exported successfully");
    } catch (err) {
      toast.error("Failed to export data");
    }
  };
  const handleReset = async () => {
    if (!user) return;
    const confirmed = window.confirm(
      "Are you sure you want to reset your progress? This will clear your journal and reset your quit date to NOW. This action cannot be undone."
    );
    if (confirmed) {
      try {
        const updatedUser = await api<User>(`/api/user/${user.id}/reset`, {
          method: 'POST',
        });
        setUser(updatedUser);
        toast.success("Progress reset successfully. A fresh start!");
        navigate('/dashboard');
      } catch (err) {
        toast.error("Failed to reset progress");
      }
    }
  };
  if (!user) return null;
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background pb-24 transition-colors duration-300">
      <PageHeader
        title="Profile & Settings"
        subtitle="Manage your usage plan and account preferences."
      />
      <div className="px-4 space-y-6 relative z-10">
        {/* Appearance Section */}
        <Card className="border border-border/50 shadow-sm bg-card transition-colors duration-300">
          <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                  <Palette className="w-5 h-5 text-violet-500" />
                  Appearance
              </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
              <div className="space-y-1">
                  <Label className="text-base text-foreground">Theme Mode</Label>
                  <p className="text-sm text-muted-foreground">Switch between light and dark mode</p>
              </div>
              <ThemeToggle className="static bg-secondary hover:bg-secondary/80 text-foreground" />
          </CardContent>
        </Card>
        {/* Account Details */}
        <Card className="border border-border/50 shadow-sm bg-card transition-colors duration-300">
          <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                  <UserIcon className="w-5 h-5 text-sky-500" />
                  Account Details
              </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="grid gap-1">
                  <Label className="text-muted-foreground">Email</Label>
                  <div className="font-medium text-foreground">{user.email}</div>
              </div>
              <div className="grid gap-1">
                  <Label className="text-muted-foreground">Member Since</Label>
                  <div className="font-medium text-foreground">{new Date(user.createdAt).toLocaleDateString()}</div>
              </div>
          </CardContent>
        </Card>
        {/* Usage Plan Settings */}
        <Card className="border border-border/50 shadow-sm bg-card transition-colors duration-300">
          <CardHeader>
              <CardTitle className="text-lg text-foreground">Usage Plan Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="quitDate" className="text-foreground">Start Date</Label>
                <Input
                  id="quitDate"
                  type="datetime-local"
                  {...register('quitDate')}
                  className="bg-background border-input text-foreground focus-visible:ring-violet-500"
                />
                {errors.quitDate && <p className="text-sm text-red-500">{errors.quitDate.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cost" className="text-foreground">Cost per Unit</Label>
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    {...register('costPerUnit')}
                    className="bg-background border-input text-foreground focus-visible:ring-violet-500"
                  />
                  {errors.costPerUnit && <p className="text-sm text-red-500">{errors.costPerUnit.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usage" className="text-foreground">Units per Week</Label>
                  <Input
                    id="usage"
                    type="number"
                    step="0.1"
                    {...register('unitsPerWeek')}
                    className="bg-background border-input text-foreground focus-visible:ring-violet-500"
                  />
                  {errors.unitsPerWeek && <p className="text-sm text-red-500">{errors.unitsPerWeek.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="strength" className="flex items-center gap-2 text-foreground">
                    <Zap className="w-3 h-3 text-violet-500" />
                    Nicotine (mg/ml)
                  </Label>
                  <Input
                    id="strength"
                    type="number"
                    step="0.1"
                    {...register('nicotineStrength')}
                    className="bg-background border-input text-foreground focus-visible:ring-violet-500"
                  />
                  {errors.nicotineStrength && <p className="text-sm text-red-500">{errors.nicotineStrength.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="volume" className="flex items-center gap-2 text-foreground">
                    <Beaker className="w-3 h-3 text-violet-500" />
                    Volume (ml)
                  </Label>
                  <Input
                    id="volume"
                    type="number"
                    step="0.1"
                    {...register('volumePerUnit')}
                    className="bg-background border-input text-foreground focus-visible:ring-violet-500"
                  />
                  {errors.volumePerUnit && <p className="text-sm text-red-500">{errors.volumePerUnit.message}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="puffs" className="text-foreground">Puffs per Device/Pod</Label>
                <Input
                  id="puffs"
                  type="number"
                  step="1"
                  {...register('puffsPerUnit')}
                  className="bg-background border-input text-foreground focus-visible:ring-violet-500"
                />
                <p className="text-xs text-muted-foreground">
                  Used to calculate cost per puff.
                </p>
                {errors.puffsPerUnit && <p className="text-sm text-red-500">{errors.puffsPerUnit.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="limit" className="text-foreground">Daily Puff Goal (Optional)</Label>
                <Input
                  id="limit"
                  type="number"
                  step="1"
                  placeholder="e.g. 20 (Leave 0 for no limit)"
                  {...register('dailyLimit')}
                  className="bg-background border-input text-foreground focus-visible:ring-violet-500"
                />
                <p className="text-xs text-muted-foreground">
                  Set a daily limit to help you taper off.
                </p>
                {errors.dailyLimit && <p className="text-sm text-red-500">{errors.dailyLimit.message}</p>}
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-sky-500 to-violet-600 hover:opacity-90 transition-opacity text-white" disabled={isSubmitting}>
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
        {/* Data Management */}
        <Card className="border border-border/50 shadow-sm bg-card transition-colors duration-300">
          <CardHeader>
              <CardTitle className="text-lg text-foreground">Data Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button variant="outline" onClick={handleExport} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button variant="ghost" onClick={handleReset} className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset Progress
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Exporting downloads your data as JSON. Resetting clears your journal and restarts your timer.
            </p>
          </CardContent>
        </Card>
        <Button variant="destructive" className="w-full" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </Button>
        <div className="text-center pt-4 pb-8">
          <p className="text-xs text-muted-foreground">Built with ❤�� by Aurelia | Your AI Co-founder</p>
        </div>
      </div>
    </div>
  );
}