import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Calendar, DollarSign, Wind } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { api } from '@/lib/api-client';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';
import type { User } from '@shared/types';
import { useNavigate } from 'react-router-dom';
// --- Schemas ---
const emailSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});
const profileSchema = z.object({
  quitDate: z.string().min(1, "Quit date is required"),
  costPerUnit: z.coerce.number().min(0.01, "Cost must be greater than 0"),
  unitsPerWeek: z.coerce.number().min(0.1, "Usage must be greater than 0"),
  currency: z.string().default("USD"),
});
type EmailForm = z.infer<typeof emailSchema>;
type ProfileForm = z.infer<typeof profileSchema>;
export function OnboardingPage() {
  const [step, setStep] = useState<'login' | 'profile'>('login');
  const setUser = useAppStore(s => s.setUser);
  const updateProfile = useAppStore(s => s.updateProfile);
  const user = useAppStore(s => s.user);
  const navigate = useNavigate();
  // If user exists but no profile, jump to profile step
  React.useEffect(() => {
    if (user && !user.profile) {
      setStep('profile');
    } else if (user?.profile) {
        navigate('/dashboard');
    }
  }, [user, navigate]);
  const handleLogin = async (data: EmailForm) => {
    try {
      const user = await api<User>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      setUser(user);
      if (user.profile) {
        toast.success("Welcome back!");
        navigate('/dashboard');
      } else {
        setStep('profile');
        toast.success("Account created! Let's set up your plan.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    }
  };
  const handleProfileSubmit = async (data: ProfileForm) => {
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
      toast.success("You're all set! Freedom starts now.");
      navigate('/dashboard');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save profile");
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="w-12 h-12 bg-emerald-500 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Wind className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Exhale</h1>
          <p className="text-muted-foreground">Your journey to freedom begins here.</p>
        </div>
        <AnimatePresence mode="wait">
          {step === 'login' ? (
            <LoginForm key="login" onSubmit={handleLogin} />
          ) : (
            <ProfileWizard key="profile" onSubmit={handleProfileSubmit} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
function LoginForm({ onSubmit }: { onSubmit: (data: EmailForm) => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<EmailForm>({
    resolver: zodResolver(emailSchema) as any
  });
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="border-none shadow-xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register('email')}
                className="h-12"
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>
            <Button type="submit" className="w-full h-12 text-lg bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Get Started"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
function ProfileWizard({ onSubmit }: { onSubmit: (data: ProfileForm) => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema) as any,
    defaultValues: {
      quitDate: new Date().toISOString().slice(0, 16), // Local datetime-local format
      currency: 'USD',
      costPerUnit: 0,
      unitsPerWeek: 0
    }
  });
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <Card className="border-none shadow-xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-500" />
                When did you quit?
              </Label>
              <Input
                type="datetime-local"
                {...register('quitDate')}
                className="h-12"
              />
              {errors.quitDate && <p className="text-sm text-red-500">{errors.quitDate.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                  Cost per pod/pack
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register('costPerUnit')}
                  className="h-12"
                />
                {errors.costPerUnit && <p className="text-sm text-red-500">{errors.costPerUnit.message}</p>}
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-emerald-500" />
                  Pods per week
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="0"
                  {...register('unitsPerWeek')}
                  className="h-12"
                />
                {errors.unitsPerWeek && <p className="text-sm text-red-500">{errors.unitsPerWeek.message}</p>}
              </div>
            </div>
            <Button type="submit" className="w-full h-12 text-lg bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Start Tracking"} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}