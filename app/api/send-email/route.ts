import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ubaydaazad@gmail.com',
        pass: 'qqsi cfpn vmwh argz',
      },
    });

    const mailOptions = {
      from: 'ubaydaazad@gmail.com',
      to: email,
      subject: 'Your MetroSync Teacher Account Credentials',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Welcome to MetroSync, ${name}!</h2>
          <p>Your teacher account has been created successfully.</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Login Email:</strong> ${email}</p>
            <p><strong>Temporary Password:</strong> ${password}</p>
          </div>
          <p>Please log in and change your password as soon as possible.</p>
          <p>Best regards,<br>The MetroSync Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true, message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send email' },
      { status: 500 }
    );
  }
}
