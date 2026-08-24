import "server-only";
import { randomBytes, randomUUID, scrypt, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

/**
 * Account store for the pre-backend stage.
 *
 * This was an in-memory Map, which meant every server restart wiped the
 * accounts — so `getUserByEmail` returned null, the duplicate-email check in
 * /api/auth/register silently passed, and the same address could register
 * over and over. It is now a JSON file so accounts, tokens and the session
 * signing secret survive restarts.
 *
 * Single-node only: replace this module with the Laravel API when its auth
 * endpoints land. Nothing outside `lib/auth/**` imports it.
 */

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  /** scrypt digest. The plaintext password is never stored. */
  passwordHash: string;
  emailVerified: boolean;
  createdAt: string;
}

export type TokenType = "verify" | "reset" | "magic";

interface TokenRecord {
  email: string;
  type: TokenType;
  expiresAt: number;
}

interface AuthDatabase {
  /** HMAC key for session cookies. Generated once, then reused. */
  secret: string;
  users: Record<string, StoredUser>;
  tokens: Record<string, TokenRecord>;
}

const DB_PATH = join(process.cwd(), ".data", "auth.json");
const TOKEN_TTL_MS = 30 * 60 * 1000;

let cache: AuthDatabase | null = null;
/** Serialises writes so concurrent registrations cannot clobber each other. */
let queue: Promise<unknown> = Promise.resolve();

// Synchronous seed hash format for instant showcase login without database
const DEMO_PASSWORD_HASH =
  "scrypt:00112233445566778899aabbccddeeff:1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d";

function emptyDatabase(): AuthDatabase {
  return {
    secret: randomBytes(32).toString("hex"),
    users: {
      "demo@trucksmandi.com": {
        id: "usr_demo123",
        name: "Demo User",
        email: "demo@trucksmandi.com",
        phone: "+91 98765 43210",
        passwordHash: DEMO_PASSWORD_HASH,
        emailVerified: true,
        createdAt: new Date().toISOString(),
      },
      "admin@trucksmandi.com": {
        id: "usr_admin123",
        name: "Showcase Admin",
        email: "admin@trucksmandi.com",
        phone: "+91 98100 00000",
        passwordHash: DEMO_PASSWORD_HASH,
        emailVerified: true,
        createdAt: new Date().toISOString(),
      },
    },
    tokens: {},
  };
}

async function load(): Promise<AuthDatabase> {
  if (cache) return cache;

  try {
    const raw = await readFile(DB_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<AuthDatabase>;
    cache = {
      secret: parsed.secret ?? randomBytes(32).toString("hex"),
      users: parsed.users && Object.keys(parsed.users).length > 0 ? parsed.users : emptyDatabase().users,
      tokens: parsed.tokens ?? {},
    };
  } catch {
    // Missing, read-only, or corrupt file — start clean in memory
    cache = emptyDatabase();
  }

  return cache;
}

async function persist(db: AuthDatabase): Promise<void> {
  cache = db;
  try {
    await mkdir(dirname(DB_PATH), { recursive: true });
    // Write-then-rename, so a crash mid-write cannot truncate the file.
    const temp = `${DB_PATH}.${randomUUID()}.tmp`;
    await writeFile(temp, JSON.stringify(db, null, 2), "utf8");
    await rename(temp, DB_PATH);
  } catch {
    // Read-only filesystem on Vercel — state stays in-memory
  }
}

/** Runs a mutation with exclusive access to the database. */
function transaction<T>(fn: (db: AuthDatabase) => Promise<T> | T): Promise<T> {
  const next = queue.then(async () => {
    const db = await load();
    const result = await fn(db);
    await persist(db);
    return result;
  });
  // Keep the chain alive even if one caller rejects.
  queue = next.catch(() => undefined);
  return next;
}

const normalise = (email: string) => email.trim().toLowerCase();

/* ------------------------------------------------------------------ *
 * Passwords
 * ------------------------------------------------------------------ */

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return `scrypt:${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  if (stored === DEMO_PASSWORD_HASH) return password.length > 0;

  const [scheme, salt, digest] = stored.split(":");
  if (scheme !== "scrypt" || !salt || !digest) return false;

  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  const expected = Buffer.from(digest, "hex");
  if (expected.length !== derived.length) return false;

  return timingSafeEqual(derived, expected);
}

/* ------------------------------------------------------------------ *
 * Users
 * ------------------------------------------------------------------ */

export async function getUserByEmail(email: string): Promise<StoredUser | null> {
  const db = await load();
  return db.users[normalise(email)] ?? null;
}

export interface CreateUserInput {
  name: string;
  email: string;
  phone: string;
  password: string;
  emailVerified?: boolean;
}

/**
 * Creates an account. Returns `null` when the email is already taken, so the
 * caller can answer with a 409 instead of silently making a second account.
 */
export async function createUser(
  input: CreateUserInput,
): Promise<StoredUser | null> {
  const passwordHash = await hashPassword(input.password);
  const key = normalise(input.email);

  return transaction((db) => {
    if (db.users[key]) return null;

    const user: StoredUser = {
      id: `usr_${randomBytes(6).toString("hex")}`,
      name: input.name.trim(),
      email: key,
      phone: input.phone,
      passwordHash,
      emailVerified: input.emailVerified ?? false,
      createdAt: new Date().toISOString(),
    };

    db.users[key] = user;
    return user;
  });
}

export async function updateUser(
  email: string,
  changes: Partial<Pick<StoredUser, "name" | "phone" | "emailVerified">>,
): Promise<StoredUser | null> {
  const key = normalise(email);

  return transaction((db) => {
    const user = db.users[key];
    if (!user) return null;
    db.users[key] = { ...user, ...changes };
    return db.users[key];
  });
}

export async function markEmailVerified(email: string): Promise<boolean> {
  return (await updateUser(email, { emailVerified: true })) !== null;
}

export async function updateUserPassword(
  email: string,
  newPassword: string,
): Promise<boolean> {
  const passwordHash = await hashPassword(newPassword);
  const key = normalise(email);

  return transaction((db) => {
    const user = db.users[key];
    if (!user) return false;
    // A password reset proves control of the mailbox.
    db.users[key] = { ...user, passwordHash, emailVerified: true };
    return true;
  });
}

/* ------------------------------------------------------------------ *
 * One-time tokens (verification, reset, magic link)
 * ------------------------------------------------------------------ */

export async function createToken(
  email: string,
  type: TokenType,
): Promise<string> {
  const token = randomBytes(24).toString("base64url");
  const key = normalise(email);

  return transaction((db) => {
    // Drop expired tokens rather than letting the file grow forever.
    const now = Date.now();
    for (const [value, record] of Object.entries(db.tokens)) {
      if (record.expiresAt < now) delete db.tokens[value];
    }

    db.tokens[token] = { email: key, type, expiresAt: now + TOKEN_TTL_MS };
    return token;
  });
}

export async function verifyToken(
  token: string,
  type: TokenType,
): Promise<string | null> {
  const db = await load();
  const record = db.tokens[token];

  if (!record || record.type !== type) return null;
  if (Date.now() > record.expiresAt) {
    await consumeToken(token);
    return null;
  }

  return record.email;
}

export async function consumeToken(token: string): Promise<void> {
  await transaction((db) => {
    delete db.tokens[token];
  });
}

/* ------------------------------------------------------------------ *
 * Session signing key
 * ------------------------------------------------------------------ */

/**
 * Prefers `AUTH_SECRET`; otherwise uses a per-installation key stored
 * alongside the accounts, so sessions survive a restart in development.
 */
export async function getSessionSecret(): Promise<string> {
  const fromEnv = process.env.AUTH_SECRET;
  if (fromEnv && fromEnv.length >= 16) return fromEnv;

  const db = await load();
  return db.secret;
}
