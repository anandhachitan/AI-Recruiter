import { FEEDBACK_PROMPT } from "@/services/Constants";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req) {
    try {
        const { conversation } = await req.json();

        if (!conversation) {
            return NextResponse.json({ error: "No conversation provided" }, { status: 400 });
        }

        const FINAL_PROMPT = FEEDBACK_PROMPT.replace('{{conversation}}', JSON.stringify(conversation));

        const openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.OPENROUTER_API_KEY,
        });

        const completion = await openai.chat.completions.create({
            model: "openai/gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: FINAL_PROMPT,
                },
            ],
        });

        return NextResponse.json(completion.choices[0].message);
    } catch (e) {
        console.error("Feedback API Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
