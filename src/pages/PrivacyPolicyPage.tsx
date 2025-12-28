import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background py-12 px-4 transition-colors duration-300">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon" className="hover:bg-slate-200 dark:hover:bg-slate-800">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
        </div>
        <Card className="border-none shadow-sm bg-card">
          <CardContent className="p-8 space-y-6 text-foreground">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                <Shield className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Your Privacy Matters</h2>
                <p className="text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
            <section className="space-y-3">
              <h3 className="text-lg font-semibold">1. Introduction</h3>
              <p className="text-muted-foreground leading-relaxed">
                Exhale ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by Exhale.
              </p>
            </section>
            <section className="space-y-3">
              <h3 className="text-lg font-semibold">2. Data Collection & Storage</h3>
              <p className="text-muted-foreground leading-relaxed">
                Exhale is designed with privacy in mind.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                <li><strong>Account Data:</strong> When you sign up, we create a unique anonymous identifier for your account. We do not require real names or phone numbers.</li>
                <li><strong>Usage Data:</strong> Your journal entries, quit dates, and settings are stored securely using Cloudflare Durable Objects.</li>
                <li><strong>Local Storage:</strong> Some preferences (like theme settings) are stored locally on your device.</li>
              </ul>
            </section>
            <section className="space-y-3">
              <h3 className="text-lg font-semibold">3. Data Usage</h3>
              <p className="text-muted-foreground leading-relaxed">
                We use your data solely to provide the functionality of the application:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                <li>To calculate your smoke-free time and savings.</li>
                <li>To display your health recovery milestones.</li>
                <li>To sync your progress across your devices.</li>
              </ul>
              <p className="text-muted-foreground font-medium mt-2">
                We do not sell, trade, or rent your personal identification information to others.
              </p>
            </section>
            <section className="space-y-3">
              <h3 className="text-lg font-semibold">4. Data Deletion</h3>
              <p className="text-muted-foreground leading-relaxed">
                You have full control over your data. You can reset your progress or delete specific journal entries directly within the app. If you wish to completely wipe your account, you may contact support or use the "Reset Progress" feature which clears your personal history.
              </p>
            </section>
            <section className="space-y-3">
              <h3 className="text-lg font-semibold">5. Contact Us</h3>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us through the application support channels.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}