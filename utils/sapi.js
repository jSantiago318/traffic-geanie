// [TODO: sapi.js is the API file holding the user data]
import { supabase } from "./supabase";

// User functions
export async function getUserEmail() {
  const user = await supabase.auth.user();
  return user.email;
}

export async function getUserId() {
  const user = await supabase.auth.user();
  return user.id;
}

// Trip functions
export async function getUserTrips() {
  const trips = await supabase
    .from("trips")
    .select("*")
    .eq("user_id", await getUserId());

  return trips;
}


