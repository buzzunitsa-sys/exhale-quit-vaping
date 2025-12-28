import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Wind, Calendar, DollarSign, Beaker, Globe, Download, Share, PlusSquare, MoreVertical, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { api } from '@/lib/api-client';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';
import type { User, QuitProfile } from '@shared/types';
import { useNavigate } from 'react-router-dom';
import { COUNTRIES, type Country } from '@/lib/constants';
import { useInstallPrompt } from '@/hooks/use-install-prompt';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// --- Schemas ---
const emailSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});
const countryStepSchema = z.object({
  country: z.string().min(1, "Please select a country"),
  currency: z.string().min(1, "Currency is required"),
});
const nicotineStepSchema = z.object({
  nicotineStrength: z.coerce.number().min(0, "Strength must be positive"),
});
const usageStepSchema = z.object({
  costPerUnit: z.coerce.number().min(0.01, "Cost must be greater than 0"),
  unitsPerWeek: z.coerce.number().min(0.1, "Usage must be greater than 0"),
  volumePerUnit: z.coerce.number().min(0.1, "Volume must be greater than 0").default(1.0),
  currency: z.string().default("USD"),
});
const liquidStepSchema = z.object({
  mlPerPuff: z.coerce.number().min(0.001, "Must be greater than 0").default(0.05),
});
const goalsStepSchema = z.object({
  quitDate: z.string().min(1, "Quit date is required"),
});
const dailyPuffsSchema = z.object({
  dailyLimit: z.coerce.number().min(1, "Must be at least 1").default(200),
});
type EmailForm = z.infer<typeof emailSchema>;
type CountryForm = z.infer<typeof countryStepSchema>;
type NicotineForm = z.infer<typeof nicotineStepSchema>;
type UsageForm = z.infer<typeof usageStepSchema>;
type LiquidForm = z.infer<typeof liquidStepSchema>;
type GoalsForm = z.infer<typeof goalsStepSchema>;
type DailyPuffsForm = z.infer<typeof dailyPuffsSchema>;
type Step = 'login' | 'intro' | 'country' | 'nicotine' | 'usage' | 'liquid' | 'goals' | 'daily-puffs';
export function OnboardingPage() {
  const [step, setStep] = useState<Step>('login');
  const [wizardData, setWizardData] = useState<Partial<QuitProfile>>({});
  const setUser = useAppStore(s => s.setUser);
  const updateProfile = useAppStore(s => s.updateProfile);
  const user = useAppStore(s => s.user);
  const navigate = useNavigate();
  React.useEffect(() => {
    if (user?.profile) {
      navigate('/dashboard');
    } else if (user && step === 'login') {
      setStep('intro');
    }
  }, [user, navigate, step]);
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
        setStep('intro');
        toast.success("Account created!");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    }
  };
  const handleSkipDefaults = async () => {
    if (!user) return;
    const defaultProfile: QuitProfile = {
      quitDate: new Date().toISOString(),
      costPerUnit: 0,
      unitsPerWeek: 0,
      puffsPerUnit: 200,
      mlPerPuff: 0.05,
      dailyLimit: 200,
      currency: 'USD',
      country: 'US',
      nicotineStrength: 50,
      volumePerUnit: 1.0
    };
    try {
      const updatedUser = await api<User>(`/api/user/${user.id}/profile`, {
        method: 'POST',
        body: JSON.stringify({ profile: defaultProfile }),
      });
      setUser(updatedUser);
      if (updatedUser.profile) {
        updateProfile(updatedUser.profile);
      }
      toast.success("Profile set to defaults. You can edit this later!");
      navigate('/dashboard');
    } catch (err) {
      toast.error("Failed to set default profile");
    }
  };
  const handleCountrySubmit = (data: CountryForm) => {
    setWizardData(prev => ({ ...prev, ...data }));
    setStep('nicotine');
  };
  const handleNicotineSubmit = (data: NicotineForm) => {
    setWizardData(prev => ({ ...prev, ...data }));
    setStep('usage');
  };
  const handleUsageSubmit = (data: UsageForm) => {
    setWizardData(prev => ({ ...prev, ...data }));
    setStep('liquid');
  };
  const handleLiquidSubmit = (data: LiquidForm) => {
    setWizardData(prev => ({ ...prev, ...data }));
    setStep('goals');
  };
  const handleGoalsSubmit = (data: GoalsForm) => {
    setWizardData(prev => ({ ...prev, ...data }));
    setStep('daily-puffs');
  };
  const handleDailyPuffsSubmit = async (data: DailyPuffsForm) => {
    if (!user) return;
    const finalProfile = { ...wizardData, ...data } as QuitProfile;
    try {
      const updatedUser = await api<User>(`/api/user/${user.id}/profile`, {
        method: 'POST',
        body: JSON.stringify({ profile: finalProfile }),
      });
      setUser(updatedUser);
      if (updatedUser.profile) {
        updateProfile(updatedUser.profile);
      }
      toast.success("You're all set! Start tracking.");
      navigate('/dashboard');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save profile");
    }
  };
  const goBack = () => {
    if (step === 'country') setStep('intro');
    if (step === 'nicotine') setStep('country');
    if (step === 'usage') setStep('nicotine');
    if (step === 'liquid') setStep('usage');
    if (step === 'goals') setStep('liquid');
    if (step === 'daily-puffs') setStep('goals');
  };
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        {step === 'login' && (
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-violet-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-sky-500/30">
              <Wind className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-violet-600">Exhale</h1>
            <p className="text-muted-foreground">Track your usage. Regain control.</p>
          </div>
        )}
        <AnimatePresence mode="wait">
          {step === 'login' && <LoginForm key="login" onSubmit={handleLogin} />}
          {step === 'intro' && <IntroStep key="intro" onNext={() => setStep('country')} onSkip={handleSkipDefaults} />}
          {step === 'country' && <CountryStep key="country" onSubmit={handleCountrySubmit} onBack={goBack} />}
          {step === 'nicotine' && <NicotineStep key="nicotine" onSubmit={handleNicotineSubmit} onBack={goBack} />}
          {step === 'usage' && <UsageStep key="usage" onSubmit={handleUsageSubmit} onBack={goBack} currency={wizardData.currency || '$'} />}
          {step === 'liquid' && <LiquidStep key="liquid" onSubmit={handleLiquidSubmit} onBack={goBack} />}
          {step === 'goals' && <GoalsStep key="goals" onSubmit={handleGoalsSubmit} onBack={goBack} />}
          {step === 'daily-puffs' && <DailyPuffsStep key="daily-puffs" onSubmit={handleDailyPuffsSubmit} onBack={goBack} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
function LoginForm({ onSubmit }: { onSubmit: (data: EmailForm) => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<EmailForm>({
    resolver: zodResolver(emailSchema) as any
  });
  const { isInstallable, promptInstall, showInstructions, setShowInstructions, isIOS } = useInstallPrompt();
  const loginAsGuest = useAppStore(s => s.loginAsGuest);
  const navigate = useNavigate();
  const handleGuestLogin = () => {
    loginAsGuest();
    navigate('/dashboard');
    toast.success("Welcome to Guest Mode!");
  };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <Card className="border border-border/50 shadow-xl bg-card transition-colors duration-300">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email Address</Label>
              <Input id="email" type="email" placeholder="you@example.com" {...register('email')} className="h-12 bg-background border-input text-foreground focus-visible:ring-sky-500" />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>
            <Button type="submit" className="w-full h-12 text-lg bg-gradient-to-r from-sky-500 to-violet-600 hover:opacity-90 transition-opacity text-white" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Get Started"}
            </Button>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleGuestLogin}
              className="w-full h-12 text-base gap-2 border-sky-200 hover:bg-sky-50 dark:border-sky-900/30 dark:hover:bg-sky-900/20 text-sky-600 dark:text-sky-400"
            >
              <Eye className="w-4 h-4" />
              Continue as Guest
            </Button>
            {isInstallable && (
              <div className="pt-2 border-t border-border/50 mt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={promptInstall}
                  className="w-full gap-2 text-muted-foreground hover:text-foreground"
                >
                  <Download className="w-4 h-4" />
                  Install App
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Install Exhale</DialogTitle>
            <DialogDescription>
              Follow these steps to add Exhale to your home screen:
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue={isIOS ? "ios" : "android"} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ios">iOS (Safari)</TabsTrigger>
              <TabsTrigger value="android">Android / Chrome</TabsTrigger>
            </TabsList>
            <TabsContent value="ios" className="space-y-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="bg-secondary p-2 rounded-md shrink-0">
                  <Share className="w-5 h-5" />
                </div>
                <p className="text-sm">1. Tap the <strong>Share</strong> button in your browser menu.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-secondary p-2 rounded-md shrink-0">
                  <PlusSquare className="w-5 h-5" />
                </div>
                <p className="text-sm">2. Scroll down and tap <strong>Add to Home Screen</strong>.</p>
              </div>
            </TabsContent>
            <TabsContent value="android" className="space-y-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="bg-secondary p-2 rounded-md shrink-0">
                  <MoreVertical className="w-5 h-5" />
                </div>
                <p className="text-sm">1. Tap the <strong>Menu</strong> (three dots) button in Chrome.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-secondary p-2 rounded-md shrink-0">
                  <Download className="w-5 h-5" />
                </div>
                <p className="text-sm">2. Tap <strong>Install App</strong> or <strong>Add to Home screen</strong>.</p>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
function IntroStep({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 pt-8">
      <div className="space-y-4">
        <h2 className="text-4xl font-bold tracking-tight text-foreground leading-tight">
          Welcome to your new beginning.
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
          We're here to help you regain control, one breath at a time.
        </p>
        <p className="text-base text-muted-foreground">
          To give you the best experience, we'll need to ask a few quick questions about your habits and location. This helps us track your savings and health progress accurately.
        </p>
      </div>
      <div className="space-y-4 pt-4">
        <Button onClick={onNext} className="w-full h-14 text-lg font-semibold bg-sky-500 hover:bg-sky-600 text-white rounded-full shadow-lg shadow-sky-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
          LET'S START
        </Button>
        <Button variant="ghost" onClick={onSkip} className="w-full text-muted-foreground hover:text-foreground hover:bg-transparent">
          Skip and use defaults
        </Button>
      </div>
    </motion.div>
  );
}
function WizardHeader({ step, total, onBack }: { step: number, total: number, onBack: () => void }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <Button variant="ghost" size="icon" onClick={onBack} className="-ml-2 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-6 h-6" />
      </Button>
      <span className="text-sm font-medium text-muted-foreground">{step}/{total}</span>
      <div className="w-10" />
    </div>
  );
}
function CountryStep({ onSubmit, onBack }: { onSubmit: (data: CountryForm) => void, onBack: () => void }) {
  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const handleSelect = (country: Country) => {
    setSelectedCountry(country);
    setOpen(false);
    onSubmit({
      country: country.code,
      currency: country.currencyCode
    });
  };
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full">
      <WizardHeader step={1} total={6} onBack={onBack} />
      <div className="space-y-6 flex-1">
        <h2 className="text-3xl font-bold text-foreground leading-tight">
          Where are you located?
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
          This helps us set the correct currency and units for your tracking.
        </p>
        <div className="mt-8">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full h-14 justify-between text-lg px-4 border-input bg-background hover:bg-accent hover:text-accent-foreground"
              >
                {selectedCountry ? (
                  <span className="flex items-center gap-2">
                    <span className="text-2xl">{selectedCountry.currency}</span>
                    {selectedCountry.name}
                  </span>
                ) : (
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Globe className="w-5 h-5" /> Select Country...
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search country..." />
                <CommandList>
                  <CommandEmpty>No country found.</CommandEmpty>
                  <CommandGroup>
                    {COUNTRIES.map((country) => (
                      <CommandItem
                        key={country.code}
                        value={country.name}
                        onSelect={() => handleSelect(country)}
                        className="flex items-center justify-between py-3 cursor-pointer"
                      >
                        <span>{country.name}</span>
                        <span className="text-muted-foreground font-mono">{country.currency}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </motion.div>
  );
}
function NicotineStep({ onSubmit, onBack }: { onSubmit: (data: NicotineForm) => void, onBack: () => void }) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<NicotineForm>({
    resolver: zodResolver(nicotineStepSchema) as any,
    defaultValues: { nicotineStrength: 50 }
  });
  const handleUseDefault = () => {
    setValue('nicotineStrength', 50);
    handleSubmit(onSubmit)();
  };
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full">
      <WizardHeader step={2} total={6} onBack={onBack} />
      <div className="space-y-6 flex-1">
        <h2 className="text-3xl font-bold text-foreground leading-tight">
          What's your e-liquid's nicotine strength?
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
          You can find it on your e-liquid bottle.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mt-8">
          <div className="flex items-center justify-center gap-4">
            <div className="relative w-32">
              <Input type="number" step="0.1" {...register('nicotineStrength')} className="h-16 text-center text-2xl font-bold bg-background border-input focus-visible:ring-sky-500 rounded-xl" />
            </div>
            <span className="text-xl font-medium text-foreground">mg/ml</span>
          </div>
          {errors.nicotineStrength && <p className="text-center text-sm text-red-500">{errors.nicotineStrength.message}</p>}
          <div className="flex items-center justify-between pt-12">
            <button type="button" onClick={handleUseDefault} className="text-muted-foreground hover:text-foreground font-medium transition-colors">Use Default</button>
            <Button type="submit" className="h-12 px-8 rounded-full bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow-lg shadow-sky-500/20">NEXT</Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
function UsageStep({ onSubmit, onBack, currency }: { onSubmit: (data: UsageForm) => void, onBack: () => void, currency: string }) {
  // Find symbol for display
  const symbol = COUNTRIES.find(c => c.currencyCode === currency)?.currency || '$';
  const { register, handleSubmit, formState: { errors } } = useForm<UsageForm>({
    resolver: zodResolver(usageStepSchema) as any,
    defaultValues: {
      currency: currency,
      costPerUnit: 0,
      unitsPerWeek: 0,
      volumePerUnit: 1.0
    }
  });
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <WizardHeader step={3} total={6} onBack={onBack} />
      <h2 className="text-2xl font-bold text-foreground mb-6">Usage Habits</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-foreground">
              <DollarSign className="w-4 h-4 text-violet-500" />
              Cost per Unit ({symbol})
            </Label>
            <Input type="number" step="0.01" placeholder="0.00" {...register('costPerUnit')} className="h-12 bg-background border-input text-foreground focus-visible:ring-sky-500" />
            {errors.costPerUnit && <p className="text-sm text-red-500">{errors.costPerUnit.message}</p>}
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-foreground">
              <Wind className="w-4 h-4 text-violet-500" />
              Units per Week
            </Label>
            <Input type="number" step="0.1" placeholder="0" {...register('unitsPerWeek')} className="h-12 bg-background border-input text-foreground focus-visible:ring-sky-500" />
            {errors.unitsPerWeek && <p className="text-sm text-red-500">{errors.unitsPerWeek.message}</p>}
          </div>
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-foreground">
            <Beaker className="w-4 h-4 text-violet-500" />
            Volume per Unit (ml)
          </Label>
          <Input type="number" step="0.1" placeholder="e.g. 1.0" {...register('volumePerUnit')} className="h-12 bg-background border-input text-foreground focus-visible:ring-sky-500" />
          {errors.volumePerUnit && <p className="text-sm text-red-500">{errors.volumePerUnit.message}</p>}
        </div>
        <p className="text-xs text-muted-foreground">Volume is typically 0.7ml - 2ml for pods, or more for disposables.</p>
        <div className="pt-4">
          <Button type="submit" className="w-full h-12 text-lg bg-sky-500 hover:bg-sky-600 text-white rounded-full shadow-lg shadow-sky-500/20">NEXT</Button>
        </div>
      </form>
    </motion.div>
  );
}
function LiquidStep({ onSubmit, onBack }: { onSubmit: (data: LiquidForm) => void, onBack: () => void }) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LiquidForm>({
    resolver: zodResolver(liquidStepSchema) as any,
    defaultValues: { mlPerPuff: 0.05 }
  });
  const handleUseDefault = () => {
    setValue('mlPerPuff', 0.05);
    handleSubmit(onSubmit)();
  };
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full">
      <WizardHeader step={4} total={6} onBack={onBack} />
      <div className="space-y-6 flex-1">
        <h2 className="text-3xl font-bold text-foreground leading-tight">How much e-liquid does one puff use?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed">We usually use a default value of 0.05 ml per puff. If you're unsure, you can use the default value and adjust later if needed.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mt-12">
          <div className="flex items-center justify-center gap-4">
            <div className="relative w-32">
              <Input type="number" step="0.01" {...register('mlPerPuff')} className="h-16 text-center text-2xl font-bold bg-background border-input focus-visible:ring-sky-500 rounded-xl" />
            </div>
            <span className="text-xl font-medium text-foreground">ml</span>
          </div>
          {errors.mlPerPuff && <p className="text-center text-sm text-red-500">{errors.mlPerPuff.message}</p>}
          <div className="flex items-center justify-between pt-12 mt-auto">
            <button type="button" onClick={handleUseDefault} className="text-muted-foreground hover:text-foreground font-medium transition-colors">Use Default</button>
            <Button type="submit" className="h-12 px-8 rounded-full bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow-lg shadow-sky-500/20">NEXT</Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
function GoalsStep({ onSubmit, onBack }: { onSubmit: (data: GoalsForm) => void, onBack: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<GoalsForm>({
    resolver: zodResolver(goalsStepSchema) as any,
    defaultValues: { quitDate: new Date().toISOString().slice(0, 16) }
  });
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <WizardHeader step={5} total={6} onBack={onBack} />
      <h2 className="text-2xl font-bold text-foreground mb-6">Set Your Start Date</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-foreground">
            <Calendar className="w-4 h-4 text-violet-500" />
            Start Date
          </Label>
          <Input type="datetime-local" {...register('quitDate')} className="h-12 bg-background border-input text-foreground focus-visible:ring-sky-500" />
          {errors.quitDate && <p className="text-sm text-red-500">{errors.quitDate.message}</p>}
        </div>
        <div className="pt-4">
          <Button type="submit" className="w-full h-12 text-lg bg-sky-500 hover:bg-sky-600 text-white rounded-full shadow-lg shadow-sky-500/20">NEXT</Button>
        </div>
      </form>
    </motion.div>
  );
}
function DailyPuffsStep({ onSubmit, onBack }: { onSubmit: (data: DailyPuffsForm) => void, onBack: () => void }) {
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<DailyPuffsForm>({
    resolver: zodResolver(dailyPuffsSchema) as any,
    defaultValues: { dailyLimit: 200 }
  });
  const handleUseDefault = () => {
    setValue('dailyLimit', 200);
    handleSubmit(onSubmit)();
  };
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full">
      <WizardHeader step={6} total={6} onBack={onBack} />
      <div className="space-y-6 flex-1 flex flex-col">
        <h2 className="text-3xl font-bold text-foreground leading-tight text-center">How many puffs do you take each day?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed text-center">This will help us create a personalized plan to gradually reduce your consumption.</p>
        <p className="text-base text-muted-foreground leading-relaxed text-center">The app will adjust the quit plan based on your actual daily usage. If you're unsure, you can use the default value for now.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mt-8 flex-1 flex flex-col">
          <div className="flex items-center justify-center my-auto">
            <div className="relative w-40">
              <Input type="number" step="1" {...register('dailyLimit')} className="h-20 text-center text-3xl font-bold bg-background border-input focus-visible:ring-sky-500 rounded-2xl" />
            </div>
          </div>
          {errors.dailyLimit && <p className="text-center text-sm text-red-500">{errors.dailyLimit.message}</p>}
          <div className="flex items-center justify-between pt-8 mt-auto">
            <button type="button" onClick={handleUseDefault} className="text-muted-foreground hover:text-foreground font-medium transition-colors">Use Default</button>
            <Button type="submit" className="h-12 px-10 rounded-full bg-sky-500 hover:bg-sky-600 text-white font-bold tracking-wide shadow-lg shadow-sky-500/20" disabled={isSubmitting}>{isSubmitting ? "SAVING..." : "FINISH"}</Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}