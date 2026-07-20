import { Liveblocks } from "@liveblocks/node";

const USER_COLORS = [
  "#FF5733", // Coral Red
  "#33FF57", // Mint Green
  "#3357FF", // Electric Blue
  "#F39C12", // Amber / Warm Orange
  "#9B59B6", // Purple / Violet
  "#1ABC9C", // Turquoise / Teal
  "#E91E63", // Pink / Magenta
  "#00BCD4", // Cyan
  "#8BC34A", // Lime Green
  "#FFC107", // Gold
];

/**
 * Deterministically maps a user ID to a consistent color from a fixed palette.
 */
export function getUserColor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % USER_COLORS.length;
  return USER_COLORS[index];
}

const globalForLiveblocks = globalThis as unknown as {
  liveblocks: Liveblocks | undefined;
};

const secretKey =
  process.env.LIVEBLOCKS_SECRET_KEY &&
  process.env.LIVEBLOCKS_SECRET_KEY.startsWith("sk_")
    ? process.env.LIVEBLOCKS_SECRET_KEY
    : "sk_placeholder_key_for_build";

export const liveblocks =
  globalForLiveblocks.liveblocks ??
  new Liveblocks({
    secret: secretKey,
  });

if (process.env.NODE_ENV !== "production") {
  globalForLiveblocks.liveblocks = liveblocks;
}


