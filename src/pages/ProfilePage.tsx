import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppStore } from '@/lib/store';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import { LogOut, Save, User as UserIcon, Palette, RefreshCw, Beaker, Zap, Droplets, Target, Globe, LogIn, Download, Upload, FileJson, Heart } from 'lucide-react';
import type { User } from '@shared/types';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { PageHeader } from '@/components/ui/page-header';
import { COUNTRIES } from '@/lib/constants';
import { InstallPWA } from '@/components/InstallPWA';
const profileSchema = z.object({
  quitDate: z.string().min(1, "Quit date is required"),
  costPerUnit: z.coerce.number().min(0.01, "Cost must be greater than 0"),
  unitsPerWeek: z.coerce.number().min(0.1, "Usage must be greater than 0"),
  puffsPerUnit: z.coerce.number().min(1, "Puffs per unit must be at least 1").optional(),
  dailyLimit: z.coerce.number().min(0, "Limit cannot be negative").optional(),
  currency: z.string().default("USD"),
  country: z.string().optional(),
  nicotineStrength: z.coerce.number().min(0, "Strength must be positive").default(50),
  volumePerUnit: z.coerce.number().min(0.1, "Volume must be positive").default(1.0),
  mlPerPuff: z.coerce.number().min(0.001, "Must be positive").default(0.05),
  motivation: z.string().optional(),
  savingsGoal: z.object({
    name: z.string().optional(),
    cost: z.coerce.number().min(0).optional(),
  }).optional(),
});
type ProfileForm = z.infer<typeof profileSchema>;
export function ProfilePage() {
  const user = useAppStore(s => s.user);
  const setUser = useAppStore(s => s.setUser);
  const updateProfile = useAppStore(s => s.updateProfile);
  const logout = useAppStore(s => s.logout);
  const isGuest = useAppStore(s => s.isGuest);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema) as any,
    defaultValues: {
      quitDate: user?.profile?.quitDate || new Date().toISOString().slice(0, 16),
      costPerUnit: user?.profile?.costPerUnit || 0,
      unitsPerWeek: user?.profile?.unitsPerWeek || 0,
      puffsPerUnit: user?.profile?.puffsPerUnit || 200,
      dailyLimit: user?.profile?.dailyLimit || 0,
      currency: user?.profile?.currency || 'USD',
      country: user?.profile?.country || 'US',
      nicotineStrength: user?.profile?.nicotineStrength || 50,
      volumePerUnit: user?.profile?.volumePerUnit || 1.0,
      mlPerPuff: user?.profile?.mlPerPuff || 0.05,
      motivation: user?.profile?.motivation || "",
      savingsGoal: {
        name: user?.profile?.savingsGoal?.name || "",
        cost: user?.profile?.savingsGoal?.cost || 0,
      }
    }
  });
  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success("Logged out successfully");
  };
  const handleSignUp = () => {
    logout(); // Clear guest session
    navigate('/'); // Go to onboarding
  };
  const onSubmit = async (data: ProfileForm) => {
    if (!user) return;
    if (isGuest) {
      toast.info("Sign in to save changes");
      return;
    }
    // Clean up savings goal if empty
    let profileData = { ...data };
    if (!profileData.savingsGoal?.name || !profileData.savingsGoal?.cost) {
        delete profileData.savingsGoal;
    }
    try {
      const updatedUser = await api<User>(`/api/user/${user.id}/profile`, {
        method: 'POST',
        body: JSON.stringify({ profile: profileData }),
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
  const handleReset = async () => {
    if (!user) return;
    if (isGuest) return;
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
  };
  const handleExport = () => {
    if (!user) return;
    const dataStr = JSON.stringify(user, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exhale-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Backup downloaded successfully");
  };
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        // Basic validation
        if (!json.profile || !json.journal) {
          throw new Error("Invalid backup file format");
        }
        const updatedUser = await api<User>(`/api/user/${user.id}/data/import`, {
          method: 'POST',
          body: JSON.stringify(json),
        });
        setUser(updatedUser);
        toast.success("Data imported successfully!");
        // Reset file input
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (err) {
        console.error("Import failed", err);
        toast.error("Failed to import data. Invalid file.");
      }
    };
    reader.readAsText(file);
  };
  const handleCountryChange = (code: string) => {
    if (isGuest) return;
    setValue('country', code);
    const country = COUNTRIES.find(c => c.code === code);
    if (country) {
      setValue('currency', country.currencyCode);
    }
  };
  const selectedCountryCode = watch('country');
  const selectedCurrency = watch('currency');
  const currencySymbol = COUNTRIES.find(c => c.currencyCode === selectedCurrency)?.currency || '$';
  if (!user) return null;
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background pb-24 transition-colors duration-300">
      <PageHeader
        title="Profile & Settings"
        subtitle={isGuest ? "Preview Mode - Sign in to customize" : "Manage your usage plan and account preferences."}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
        {isGuest && (
          <Card className="border-violet-200 bg-violet-50 dark:bg-violet-900/20 dark:border-violet-800">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="bg-violet-100 dark:bg-violet-800 p-2 rounded-full">
                <UserIcon className="w-6 h-6 text-violet-600 dark:text-violet-300" />
              </div>
              <div>
                <h3 className="font-bold text-violet-900 dark:text-violet-100">Guest Profile</h3>
                <p className="text-sm text-violet-700 dark:text-violet-300">You are viewing sample data. Settings are read-only.</p>
              </div>
            </CardContent>
          </Card>
        )}
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
        {/* App Installation Section - Hide for Guest */}
        {!isGuest && <InstallPWA />}
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="quitDate" className="text-foreground">Start Date</Label>
                <Input
                  id="quitDate"
                  type="datetime-local"
                  {...register('quitDate')}
                  disabled={isGuest}
                  className="bg-background border-input text-foreground focus-visible:ring-violet-500 disabled:opacity-70"
                />
                {errors.quitDate && <p className="text-sm text-red-500">{errors.quitDate.message}</p>}
              </div>
              {/* Country & Currency Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-foreground">
                    <Globe className="w-4 h-4 text-violet-500" />
                    Country
                  </Label>
                  <Select value={selectedCountryCode} onValueChange={handleCountryChange} disabled={isGuest}>
                    <SelectTrigger className="bg-background border-input text-foreground disabled:opacity-70">
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map(c => (
                        <SelectItem key={c.code} value={c.code}>
                          {c.name} ({c.currency})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency" className="text-foreground">Currency Code</Label>
                  <Input
                    id="currency"
                    {...register('currency')}
                    disabled={isGuest}
                    className="bg-background border-input text-foreground focus-visible:ring-violet-500 disabled:opacity-70"
                  />
                  <p className="text-xs text-muted-foreground">Automatically set by country, but editable.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cost" className="text-foreground">Cost per Unit ({currencySymbol})</Label>
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    {...register('costPerUnit')}
                    disabled={isGuest}
                    className="bg-background border-input text-foreground focus-visible:ring-violet-500 disabled:opacity-70"
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
                    disabled={isGuest}
                    className="bg-background border-input text-foreground focus-visible:ring-violet-500 disabled:opacity-70"
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
                    disabled={isGuest}
                    className="bg-background border-input text-foreground focus-visible:ring-violet-500 disabled:opacity-70"
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
                    disabled={isGuest}
                    className="bg-background border-input text-foreground focus-visible:ring-violet-500 disabled:opacity-70"
                  />
                  {errors.volumePerUnit && <p className="text-sm text-red-500">{errors.volumePerUnit.message}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mlPerPuff" className="flex items-center gap-2 text-foreground">
                  <Droplets className="w-3 h-3 text-violet-500" />
                  Liquid per Puff (ml)
                </Label>
                <Input
                  id="mlPerPuff"
                  type="number"
                  step="0.01"
                  {...register('mlPerPuff')}
                  disabled={isGuest}
                  className="bg-background border-input text-foreground focus-visible:ring-violet-500 disabled:opacity-70"
                />
                <p className="text-xs text-muted-foreground">
                  Used for precise cost and nicotine tracking. Default is 0.05ml.
                </p>
                {errors.mlPerPuff && <p className="text-sm text-red-500">{errors.mlPerPuff.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="limit" className="text-foreground">Daily Puff Goal (Optional)</Label>
                <Input
                  id="limit"
                  type="number"
                  step="1"
                  placeholder="e.g. 20 (Leave 0 for no limit)"
                  {...register('dailyLimit')}
                  disabled={isGuest}
                  className="bg-background border-input text-foreground focus-visible:ring-violet-500 disabled:opacity-70"
                />
                <p className="text-xs text-muted-foreground">
                  Set a daily limit to help you taper off.
                </p>
                {errors.dailyLimit && <p className="text-sm text-red-500">{errors.dailyLimit.message}</p>}
              </div>
              {/* Motivation Section */}
              <div className="pt-4 border-t border-border/50">
                <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-500" />
                  My Motivation
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="motivation" className="text-foreground">Why are you quitting?</Label>
                  <Textarea
                    id="motivation"
                    placeholder="e.g. For my health, to save money for travel, for my family..."
                    {...register('motivation')}
                    disabled={isGuest}
                    className="bg-background border-input text-foreground focus-visible:ring-pink-500 disabled:opacity-70 resize-none h-24"
                  />
                  <p className="text-xs text-muted-foreground">
                    This will be pinned to your dashboard to keep you inspired.
                  </p>
                </div>
              </div>
              {/* Financial Goal Section */}
              <div className="pt-4 border-t border-border/50">
                <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-500" />
                  Financial Goal
                </h3>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="goalName" className="text-foreground">Goal Name</Label>
                    <Input
                      id="goalName"
                      placeholder="e.g. New Bike, Vacation"
                      {...register('savingsGoal.name')}
                      disabled={isGuest}
                      className="bg-background border-input text-foreground focus-visible:ring-indigo-500 disabled:opacity-70"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="goalCost" className="text-foreground">Goal Cost ({currencySymbol})</Label>
                    <Input
                      id="goalCost"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...register('savingsGoal.cost')}
                      disabled={isGuest}
                      className="bg-background border-input text-foreground focus-visible:ring-indigo-500 disabled:opacity-70"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Set a target to visualize what you're saving for.
                  </p>
                </div>
              </div>
              {!isGuest && (
                <Button type="submit" className="w-full bg-gradient-to-r from-sky-500 to-violet-600 hover:opacity-90 transition-opacity text-white" disabled={isSubmitting}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
        {/* Data Management - Hide for Guest */}
        {!isGuest && (
          <Card className="border border-border/50 shadow-sm bg-card transition-colors duration-300">
            <CardHeader>
                <CardTitle className="text-lg text-foreground flex items-center gap-2">
                  <FileJson className="w-5 h-5 text-emerald-500" />
                  Data Management
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" onClick={handleExport} className="w-full gap-2 border-emerald-200 hover:bg-emerald-50 dark:border-emerald-900/30 dark:hover:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                  <Download className="w-4 h-4" />
                  Export Data
                </Button>
                <Button variant="outline" onClick={handleImportClick} className="w-full gap-2 border-blue-200 hover:bg-blue-50 dark:border-blue-900/30 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                  <Upload className="w-4 h-4" />
                  Import Data
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".json"
                  onChange={handleFileChange}
                />
              </div>
              <div className="pt-4 border-t border-border/50">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reset Progress
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your journal entries and reset your quit date to right now.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleReset} className="bg-red-600 hover:bg-red-700 text-white">
                        Yes, Reset Everything
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Resetting clears your journal and restarts your timer.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        {isGuest ? (
          <Button onClick={handleSignUp} className="w-full bg-violet-600 hover:bg-violet-700 text-white">
            <LogIn className="w-4 h-4 mr-2" />
            Sign Up / Login
          </Button>
        ) : (
          <Button variant="destructive" className="w-full" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
        )}
        <div className="text-center pt-4 pb-8">
          <p className="text-xs text-muted-foreground">Built with ❤️ by Aurelia | Your AI Co-founder</p>
        </div>
      </div>
    </div>
  );
}