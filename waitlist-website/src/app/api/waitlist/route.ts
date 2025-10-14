import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "waitlist.json");

// Ensure data directory exists
async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
}

// Read existing waitlist data
async function readWaitlistData(): Promise<Array<{
  id: string;
  name: string;
  email: string;
  jobRole: string;
  remoteOnly: boolean;
  createdAt: string;
}>> {
  try {
    await ensureDataDir();
    if (!existsSync(DATA_FILE)) {
      return [];
    }
    const data = await readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading waitlist data:", error);
    return [];
  }
}

// Write waitlist data
async function writeWaitlistData(data: Array<{
  id: string;
  name: string;
  email: string;
  jobRole: string;
  remoteOnly: boolean;
  createdAt: string;
}>): Promise<void> {
  try {
    await ensureDataDir();
    await writeFile(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing waitlist data:", error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, jobRole, remoteOnly } = body;

    // Validate required fields
    if (!name || !email || !jobRole) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingData = await readWaitlistData();
    const existingSubmission = existingData.find(
      (submission) => submission.email.toLowerCase() === email.toLowerCase()
    );

    if (existingSubmission) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // Create new submission
    const newSubmission = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      jobRole,
      remoteOnly: Boolean(remoteOnly),
      createdAt: new Date().toISOString(),
    };

    // Add to existing data
    const updatedData = [...existingData, newSubmission];

    // Save to file
    await writeWaitlistData(updatedData);

    // Log successful submission
    console.log(`New waitlist submission: ${name} (${email}) - ${jobRole}`);

    return NextResponse.json(
      { 
        message: "Successfully added to waitlist",
        submission: newSubmission 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing waitlist submission:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const data = await readWaitlistData();
    
    // Return basic stats (not the full data for privacy)
    return NextResponse.json({
      count: data.length,
      message: "Waitlist data retrieved successfully"
    });
  } catch (error) {
    console.error("Error retrieving waitlist data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}