import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        subject: data.subject || null,
        message: data.message,
        status: 'New'
      },
    });

    return NextResponse.json({ success: true, contactMessage }, { status: 201 });
  } catch (error) {
    console.error('Contact submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit message' },
      { status: 500 }
    );
  }
}
