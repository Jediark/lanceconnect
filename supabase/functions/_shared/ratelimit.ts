import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

export async function checkRateLimit(
  supabase: SupabaseClient,
  userId: string | null,
  ipAddress: string | null,
  endpoint: string,
  limit: number = 60,
  windowSeconds: number = 60,
): Promise<{ allowed: boolean; remaining: number }> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - windowSeconds * 1000);

  let query = supabase
    .from("rate_limit_log")
    .select("id, count, window_start")
    .eq("endpoint", endpoint)
    .gte("window_start", windowStart.toISOString());

  if (userId) {
    query = query.eq("user_id", userId);
  } else if (ipAddress) {
    query = query.eq("ip_address", ipAddress);
  } else {
    // If we have neither user_id nor ip_address, we fail open but log a warning
    console.warn(`Rate limiter invoked for endpoint ${endpoint} without user_id or ip_address`);
    return { allowed: true, remaining: limit };
  }

  const { data, error } = await query;

  if (error) {
    console.error("Rate limit database query failed:", error);
    return { allowed: true, remaining: 1 }; // Fail open
  }

  let totalCount = 0;
  let existingRecord = null;

  if (data && data.length > 0) {
    existingRecord = data[0];
    totalCount = data.reduce((sum, item) => sum + (item.count || 0), 0);
  }

  if (totalCount >= limit) {
    return { allowed: false, remaining: 0 };
  }

  // Increment or create rate limit log
  if (existingRecord) {
    const { error: updateError } = await supabase
      .from("rate_limit_log")
      .update({ count: (existingRecord.count || 0) + 1 })
      .eq("id", existingRecord.id);
    if (updateError) {
      console.error("Failed to update rate limit count:", updateError);
    }
  } else {
    const insertData: any = {
      endpoint,
      count: 1,
      window_start: now.toISOString(),
    };
    if (userId) insertData.user_id = userId;
    if (ipAddress) insertData.ip_address = ipAddress;

    const { error: insertError } = await supabase.from("rate_limit_log").insert(insertData);
    if (insertError) {
      console.error("Failed to insert rate limit log:", insertError);
    }
  }

  return { allowed: true, remaining: limit - totalCount - 1 };
}
