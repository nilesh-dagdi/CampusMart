import { SMTPClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

Deno.serve(async (req) => {
  try {
    const { to, subject, text } = await req.json();

    const client = new SMTPClient({
      connection: {
        hostname: "smtp.gmail.com",
        port: 465,
        tls: true,
        auth: {
          username: Deno.env.get("EMAIL_USER") || "",
          password: Deno.env.get("EMAIL_PASS") || "",
        },
      },
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
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
