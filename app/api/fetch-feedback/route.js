import { supabase } from "@/services/supabaseClient";
import { NextResponse } from "next/server";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const interview_id = searchParams.get("interview_id");
    const feedback_id = searchParams.get("feedback_id");

    try {
        if (feedback_id) {
            // Fetch specific feedback
            const { data, error } = await supabase
                .from("Interview-feedback")
                .select("*")
                .eq("id", feedback_id)
                .single();

            if (error) return NextResponse.json({ error: error.message }, { status: 400 });
            return NextResponse.json(data);
        }

        if (interview_id) {
            // Fetch all feedback for an interview
            const { data, error } = await supabase
                .from("Interview-feedback")
                .select("*")
                .eq("interview_id", interview_id);

            if (error) return NextResponse.json({ error: error.message }, { status: 400 });
            return NextResponse.json(data);
        }

        return NextResponse.json({ error: "Missing parameters" }, { status: 400 });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
