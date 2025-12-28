import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, ChatBoardEntity } from "./entities";
import { ok, bad, notFound, isStr, Index } from './core-utils';
import type { User, QuitProfile, JournalEntry } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/api/health', (c) => c.json({ success: true, status: 'ok' }));
  // AUTH / USER MANAGEMENT
  app.post('/api/auth/login', async (c) => {
    const { email } = (await c.req.json()) as { email?: string };
    if (!email?.trim()) return bad(c, 'Email required');
    const cleanEmail = email.trim().toLowerCase();
    const userEntity = new UserEntity(c.env, cleanEmail);
    let user = await userEntity.getState();
    // Initialize if new
    if (!user.id) {
      user = {
        id: cleanEmail,
        email: cleanEmail,
        createdAt: Date.now()
      };
      await userEntity.save(user);
      // Add to index
      const idx = new Index<string>(c.env, UserEntity.indexName);
      await idx.add(cleanEmail);
    }
    return ok(c, user);
  });
  app.get('/api/user/:id', async (c) => {
    const id = c.req.param('id');
    const userEntity = new UserEntity(c.env, id);
    if (!await userEntity.exists()) return notFound(c, 'User not found');
    return ok(c, await userEntity.getState());
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
  // --- LEGACY / TEMPLATE ROUTES (Kept for compatibility if needed) ---
  // CHATS
  app.get('/api/chats', async (c) => {
    await ChatBoardEntity.ensureSeed(c.env);
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const page = await ChatBoardEntity.list(c.env, cq ?? null, lq ? Math.max(1, (Number(lq) | 0)) : undefined);
    return ok(c, page);
  });
  app.post('/api/chats', async (c) => {
    const { title } = (await c.req.json()) as { title?: string };
    if (!title?.trim()) return bad(c, 'title required');
    const created = await ChatBoardEntity.create(c.env, { id: crypto.randomUUID(), title: title.trim(), messages: [] });
    return ok(c, { id: created.id, title: created.title });
  });
  app.get('/api/chats/:chatId/messages', async (c) => {
    const chat = new ChatBoardEntity(c.env, c.req.param('chatId'));
    if (!await chat.exists()) return notFound(c, 'chat not found');
    return ok(c, await chat.listMessages());
  });
  app.post('/api/chats/:chatId/messages', async (c) => {
    const chatId = c.req.param('chatId');
    const { userId, text } = (await c.req.json()) as { userId?: string; text?: string };
    if (!isStr(userId) || !text?.trim()) return bad(c, 'userId and text required');
    const chat = new ChatBoardEntity(c.env, chatId);
    if (!await chat.exists()) return notFound(c, 'chat not found');
    return ok(c, await chat.sendMessage(userId, text.trim()));
  });
}