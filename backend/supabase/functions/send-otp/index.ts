import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";
import { writeAll } from "https://deno.land/std@0.145.0/streams/conversion.ts";

// Polyfill Deno.writeAll 
if (!(Deno as any).writeAll) {
  (Deno as any).writeAll = writeAll;
}

Deno.serve(async (req) => {
  try {
    const { to, subject, text } = await req.json();

    const client = new SmtpClient();

    // Explicitly using connectTLS on Port 465 (more reliable than 587 STARTTLS in some Edge environments)
    await client.connectTLS({
      hostname: "smtp.gmail.com",
      port: 465,
      username: Deno.env.get("EMAIL_USER") || "",
      password: Deno.env.get("EMAIL_PASS") || "",
    });

    await client.send({
      from: Deno.env.get("EMAIL_USER") || "",
      to: to,
      subject: subject,
      content: text,
    });

    await client.close();

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Supabase Edge Function Error:", error.message);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
