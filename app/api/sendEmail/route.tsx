import { NextRequest, NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

// Set the SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    // Parse the JSON body from the request
    const { to, subject, text } = await request.json();

    if (!to) {
      return NextResponse.json(
        { error: "'to' is required in the request body" },
        { status: 400 }
      );
    }

    // Send the email
    await sgMail.send({
      to,
      from: "abhikhati2212@gmail.com",
      subject,
      text,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: "Error sending email" }, { status: 500 });
  }
}
