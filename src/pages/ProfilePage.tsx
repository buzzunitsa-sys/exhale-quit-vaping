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
import { LogOut, Save, User as UserIcon, Palette } from 'lucide-react';
import type { User } from '@shared/types';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { PageHeader } from '@/components/ui/page-header';
const profileSchema = z.object({
  quitDate: z.string().min(1, "Quit date is required"),
  costPerUnit: z.coerce.number().min(0.01, "Cost must be greater than 0"),
  unitsPerWeek: z.coerce.number().min(0.1, "Usage must be greater than 0"),
  currency: z.string().default("USD"),
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
      currency: user?.profile?.currency || 'USD',
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
  if (!user) return null;
  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <PageHeader 
        title="Profile & Settings" 
        subtitle="Manage your quit plan and account preferences."
      />
      <div className="px-4 space-y-6 relative z-10">
        {/* Appearance Section */}
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
          <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                  <Palette className="w-5 h-5 text-bling-purple" />
                  Appearance
              </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
              <div className="space-y-1">
                  <Label className="text-base">Theme Mode</Label>
                  <p className="text-sm text-muted-foreground">Switch between light and dark mode</p>
              </div>
              <ThemeToggle className="static bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700" />
          </CardContent>
        </Card>
        {/* Account Details */}
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
          <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-bling-cyan" />
                  Account Details
              </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="grid gap-1">
                  <Label className="text-muted-foreground">Email</Label>
                  <div className="font-medium">{user.email}</div>
              </div>
              <div className="grid gap-1">
                  <Label className="text-muted-foreground">Member Since</Label>
                  <div className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</div>
              </div>
          </CardContent>
        </Card>
        {/* Quit Plan Settings */}
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
          <CardHeader>
              <CardTitle className="text-lg">Quit Plan Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="quitDate">Quit Date</Label>
                <Input
                  id="quitDate"
                  type="datetime-local"
                  {...register('quitDate')}
                  className="focus-visible:ring-bling-purple"
                />
                {errors.quitDate && <p className="text-sm text-red-500">{errors.quitDate.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost per Unit</Label>
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    {...register('costPerUnit')}
                    className="focus-visible:ring-bling-purple"
                  />
                  {errors.costPerUnit && <p className="text-sm text-red-500">{errors.costPerUnit.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usage">Units per Week</Label>
                  <Input
                    id="usage"
                    type="number"
                    step="0.1"
                    {...register('unitsPerWeek')}
                    className="focus-visible:ring-bling-purple"
                  />
                  {errors.unitsPerWeek && <p className="text-sm text-red-500">{errors.unitsPerWeek.message}</p>}
                </div>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-bling-cyan to-bling-purple hover:opacity-90 transition-opacity text-white" disabled={isSubmitting}>
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
        <Button variant="destructive" className="w-full" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </Button>
        <div className="text-center pt-4 pb-8">
          <p className="text-xs text-muted-foreground">Built with ❤️ by Aurelia</p>
        </div>
      </div>
    </div>
  );
}