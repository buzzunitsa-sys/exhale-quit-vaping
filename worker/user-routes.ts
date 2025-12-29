import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity } from "./entities";
import { ok, bad, notFound, Index } from './core-utils';
import type { QuitProfile, JournalEntry } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/api/health', (c) => c.json({ success: true, status: 'ok' }));
  // AUTH / USER MANAGEMENT
  app.post('/api/auth/login', async (c) => {
    const { email, provider } = (await c.req.json()) as { email?: string, provider?: 'email' | 'google' };
    if (!email?.trim()) return bad(c, 'Email required');
    const cleanEmail = email.trim().toLowerCase();
    const userEntity = new UserEntity(c.env, cleanEmail);
    let user = await userEntity.getState();
    const isGoogle = provider === 'google';
    // Initialize if new
    if (!user.id) {
      user = {
        id: cleanEmail,
        email: cleanEmail,
        createdAt: Date.now(),
        authProvider: isGoogle ? 'google' : 'email',
        isVerified: isGoogle, // Google users are auto-verified
        username: ''
      };
      await userEntity.save(user);
      // Add to index
      const idx = new Index<string>(c.env, UserEntity.indexName);
      await idx.add(cleanEmail);
    } else {
      // Existing user: if logging in with Google, auto-verify if not already
      if (isGoogle && !user.isVerified) {
        user = await userEntity.verifyUser();
      }
    }
    return ok(c, user);
  });
  app.post('/api/auth/verify', async (c) => {
    const { email, code } = await c.req.json() as { email: string, code: string };
    if (!email || !code) return bad(c, 'Missing fields');
    // Mock verification logic - in production this would check a stored code
    if (code !== '123456') return bad(c, 'Invalid verification code');
    const userEntity = new UserEntity(c.env, email);
    if (!await userEntity.exists()) return notFound(c, 'User not found');
    const user = await userEntity.verifyUser();
    return ok(c, user);
  });
  app.get('/api/user/:id', async (c) => {
    const id = c.req.param('id');
    const userEntity = new UserEntity(c.env, id);
    if (!await userEntity.exists()) return notFound(c, 'User not found');
    return ok(c, await userEntity.getState());
  });
  app.post('/api/user/:id/username', async (c) => {
    const id = c.req.param('id');
    const { username } = await c.req.json() as { username: string };
    if (!username?.trim()) return bad(c, 'Username required');
    const userEntity = new UserEntity(c.env, id);
    if (!await userEntity.exists()) return notFound(c, 'User not found');
    const user = await userEntity.updateUsername(username.trim());
    return ok(c, user);
  });
  app.post('/api/user/:id/profile', async (c) => {
    const id = c.req.param('id');
    const { profile } = (await c.req.json()) as { profile: QuitProfile };
    if (!profile || !profile.quitDate) return bad(c, 'Valid profile required');
    const userEntity = new UserEntity(c.env, id);
    // Auto-create if missing (shouldn't happen if logged in, but safe fallback)
    if (!await userEntity.exists()) {
        await userEntity.save({ id, email: id, createdAt: Date.now() });
        const idx = new Index<string>(c.env, UserEntity.indexName);
        await idx.add(id);
    }
    await userEntity.patch({ profile });
    return ok(c, await userEntity.getState());
  });
  app.post('/api/user/:id/journal', async (c) => {
    const id = c.req.param('id');
    const { entry } = (await c.req.json()) as { entry: JournalEntry };
    if (!entry || !entry.id || !entry.trigger) return bad(c, 'Valid journal entry required');
    const userEntity = new UserEntity(c.env, id);
    if (!await userEntity.exists()) return notFound(c, 'User not found');
    const updatedUser = await userEntity.addJournalEntry(entry);
    return ok(c, updatedUser);
  });
  app.put('/api/user/:id/journal/:entryId', async (c) => {
    const id = c.req.param('id');
    const entryId = c.req.param('entryId');
    const updates = await c.req.json<Partial<JournalEntry>>();
    if (!updates || Object.keys(updates).length === 0) return bad(c, 'No updates provided');
    const userEntity = new UserEntity(c.env, id);
    if (!await userEntity.exists()) return notFound(c, 'User not found');
    const updatedUser = await userEntity.updateJournalEntry(entryId, updates);
    return ok(c, updatedUser);
  });
  app.delete('/api/user/:id/journal/:entryId', async (c) => {
    const id = c.req.param('id');
    const entryId = c.req.param('entryId');
    const userEntity = new UserEntity(c.env, id);
    if (!await userEntity.exists()) return notFound(c, 'User not found');
    const updatedUser = await userEntity.removeJournalEntry(entryId);
    return ok(c, updatedUser);
  });
  app.post('/api/user/:id/reset', async (c) => {
    const id = c.req.param('id');
    const userEntity = new UserEntity(c.env, id);
    if (!await userEntity.exists()) return notFound(c, 'User not found');
    const updatedUser = await userEntity.resetProgress();
    return ok(c, updatedUser);
  });
  app.post('/api/user/:id/pledge', async (c) => {
    const id = c.req.param('id');
    const { date } = (await c.req.json()) as { date: string };
    if (!date) return bad(c, 'Date required');
    const userEntity = new UserEntity(c.env, id);
    if (!await userEntity.exists()) return notFound(c, 'User not found');
    const updatedUser = await userEntity.submitPledge(date);
    return ok(c, updatedUser);
  });
  app.post('/api/user/:id/data/import', async (c) => {
    const id = c.req.param('id');
    const data = await c.req.json<Partial<any>>(); // Using any to avoid strict type check on import payload structure, validated by logic
    if (!data) return bad(c, 'No data provided');
    const userEntity = new UserEntity(c.env, id);
    if (!await userEntity.exists()) return notFound(c, 'User not found');
    const updatedUser = await userEntity.importData(data);
    return ok(c, updatedUser);
  });
}