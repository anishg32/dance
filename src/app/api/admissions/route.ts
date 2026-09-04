import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";



export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Basic validation
    if (!data.studentName || !data.age || !data.phone || !data.email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    if (parseInt(data.age, 10) < 18 && !data.parentName) {
      return NextResponse.json(
        { error: 'Parent name is required for minors' },
        { status: 400 }
      );
    }

    const admission = await prisma.admission.create({
      data: {
        studentName: data.studentName,
        parentName: data.parentName || 'N/A',
        age: parseInt(data.age, 10),
        phone: data.phone,
        email: data.email,
        experience: data.experience,
        preferredLevel: data.preferredLevel,
        preferredBatch: data.preferredBatch,
        message: data.message,
        status: 'New'
      },
    });

    return NextResponse.json({ success: true, admission }, { status: 201 });
  } catch (error) {
    console.error('Admission submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit admission enquiry' },
      { status: 500 }
    );
  }
}
