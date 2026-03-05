import { NextResponse } from "next/server";
import { assignments } from "@/lib/data";

/**
 * @swagger
 * /api/assignments/{id}:
 *   get:
 *     summary: Get one assignment by id
 *     tags: [Assignments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Assignment id
 *         schema:
 *           type: string
 *           example: "1"
 *     responses:
 *       200:
 *         description: Assignment found.
 *         content:
 *           application/json:
 *             example:
 *               id: "1"
 *               title: "Calculus Problem Set 4"
 *               description: "Solve questions 1 to 20."
 *               status: "on process"
 *               assignmentDate: "2026-03-05"
 *               dueDate: "2026-03-20"
 *       404:
 *         description: Assignment not found.
 *         content:
 *           application/json:
 *             example:
 *               error: "Assignment not found"
 *   put:
 *     summary: Update an assignment by id
 *     tags: [Assignments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Assignment id
 *         schema:
 *           type: string
 *           example: "1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             title: "Calculus Problem Set 4 (Revised)"
 *             status: "submitted"
 *             dueDate: "2026-03-23"
 *     responses:
 *       200:
 *         description: Assignment updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               id: "1"
 *               title: "Calculus Problem Set 4 (Revised)"
 *               description: "Solve questions 1 to 20."
 *               status: "submitted"
 *               assignmentDate: "2026-03-05"
 *               dueDate: "2026-03-23"
 *       400:
 *         description: Invalid update values.
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid update values"
 *       404:
 *         description: Assignment not found.
 *         content:
 *           application/json:
 *             example:
 *               error: "Assignment not found"
 *   delete:
 *     summary: Delete an assignment by id (or index fallback)
 *     tags: [Assignments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Assignment id, or zero-based index fallback
 *         schema:
 *           type: string
 *           example: "1"
 *     responses:
 *       204:
 *         description: Assignment deleted successfully.
 *       404:
 *         description: Assignment id or index not found.
 *         content:
 *           application/json:
 *             example:
 *               error: "Assignment id or index not found!"
 */

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const routeParams = await params;
    const targetId = routeParams.id.trim();
    const item = assignments.find((a) => a.id === targetId);

    if (!item) {
        return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }
    
    return NextResponse.json(item, { status: 200 });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const routeParams = await params;
    const targetId = routeParams.id.trim();

    // Try to find the assignment in the data
    const item = assignments.find((a) => a.id === targetId);
    if (!item) {
        return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }

    // Update logic
    try{
        const body = await req.json()

        // Update the item/assignment by stamping the new body variable into the item, done by:
        Object.assign(item, body);

        // Important! The id should never be updated
        item.id = targetId;

        return NextResponse.json(item, { status: 200 });
    } catch (e) {
        return NextResponse.json(
            { error: "Invalid update values",
              message: e instanceof Error ? e.message : "Unknown" 
            },
            { status: 400 }
        );
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const routeParams = await params;
    const targetId = routeParams.id.trim();

    // Try to find by assignment id first
    let index = assignments.findIndex((a) => a.id === targetId)

    // Fallback: allow zero-based index in path (e.g., /api/assignments/1)
    if (index === -1) {
        const parsedIndex = Number(targetId);

        if (Number.isInteger(parsedIndex) && parsedIndex >= 0 && parsedIndex < assignments.length) {
            index = parsedIndex;
        }
    }

    // Find index function will return -1 if the index is not found (catch this error)
    if (index === -1) {
        return NextResponse.json(
            { error: "Assignment id or index not found!" },
            { status: 404 }
        )
    }

    // Remove using splice, remove 1 element starting from the index
    assignments.splice(index, 1)
    
    // Status 204 is the standard message for successfull delete
    return new NextResponse(null, { status: 204 })
}