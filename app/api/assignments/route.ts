import { NextResponse } from "next/server"
import { assignments } from "@/lib/data";

/**
 * @swagger
 * /api/assignments:
 *   get:
 *     summary: Get assignment summaries
 *     description: Returns a list of assignments with id, title, status, and dueDate.
 *     tags: [Assignments]
 *     responses:
 *       200:
 *         description: Assignment summaries retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               - id: "1"
 *                 title: "Calculus Problem Set 4"
 *                 status: "created"
 *                 dueDate: "2026-03-20"
 *   post:
 *     summary: Create a new assignment
 *     description: Creates a new assignment and auto-generates id and assignmentDate.
 *     tags: [Assignments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             title: "React Hooks Research"
 *             description: "Write a report on useEffect and useMemo usage patterns."
 *             status: "on process"
 *             dueDate: "2026-03-22"
 *     responses:
 *       201:
 *         description: Assignment created successfully.
 *         content:
 *           application/json:
 *             example:
 *               id: "7"
 *               title: "React Hooks Research"
 *               description: "Write a report on useEffect and useMemo usage patterns."
 *               status: "on process"
 *               assignmentDate: "2026-03-05"
 *               dueDate: "2026-03-22"
 *       400:
 *         description: Invalid entry values or validation error.
 *         content:
 *           application/json:
 *             example:
 *               error: "Required: title, description, status, and dueDate"
 */
export async function GET() {
    const summaryList = assignments.map(a => ({
        id: a.id,
        title: a.title,
        status: a.status,
        dueDate: a.dueDate
    }));

    return NextResponse.json(summaryList, { status: 200 });
}

// POST A new assignment
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, status, dueDate } = body;

    // Validate each required fields
    if (!title || !description || !status || !dueDate) {
      return NextResponse.json(
        { error: "Required: title, description, status, and dueDate" }, 
        { status: 400 }
      );
    }

    // Check if status is one of these values
    const validStatuses = ["created", "on process", "submitted"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Status must be: created, on process, or submitted" }, 
        { status: 400 }
      );
    }

    // Insert Logic
    const newEntry = {
      id: (assignments.length + 1).toString(),
      title,
      description,
      status,
      assignmentDate: new Date().toISOString().split('T')[0], 
      dueDate 
    };

    assignments.push(newEntry);
    return NextResponse.json(newEntry, { status: 201 });

  } catch (e) {
        return NextResponse.json(
            { error: "Invalid entry values",
                message: e instanceof Error ? e.message : "Unknown" 
            },
            { status: 400 }
        );
  }
}


