import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

    // Fetch community using owner_id
    const { data: community } = await supabase.from('communities').select('*').eq('owner_id', user.id).maybeSingle();

    // Passing userId explicitly to guarantee it is never null
    return <SettingsClient userId={user.id} initialProfile={profile} initialCommunity={community} />;
}