/**
 * Shared helper to retrieve technical specification Markdown content from Vercel Blob storage.
 */
export async function fetchSpecContent(filePath: string): Promise<string> {
  // 1. Host verification for security
  try {
    const parsedUrl = new URL(filePath);
    if (!parsedUrl.hostname.endsWith(".vercel-storage.com")) {
      throw new Error(`Unauthorized file storage host: ${parsedUrl.hostname}`);
    }
  } catch (urlErr) {
    if (urlErr instanceof Error && urlErr.message.startsWith("Unauthorized")) {
      throw urlErr;
    }
    throw new Error("Invalid specification file URL shape");
  }

  // 2. Token validation
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    console.error("BLOB_READ_WRITE_TOKEN is missing in environment variables");
    throw new Error("Blob storage configuration error: BLOB_READ_WRITE_TOKEN missing");
  }

  // 3. Authorized blob fetch with timeout
  const blobResponse = await fetch(filePath, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });

  if (!blobResponse.ok) {
    console.error(`Failed to fetch spec blob from URL: ${filePath}, status: ${blobResponse.status}`);
    throw new Error(`Failed to retrieve spec content from storage (Status ${blobResponse.status})`);
  }

  return blobResponse.text();
}
