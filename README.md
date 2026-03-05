## API Design Table

| Method     | Endpoint                | Request Body                                | Description                                                       | Status           |
| :--------- | :---------------------- | :------------------------------------------ | :---------------------------------------------------------------- | :--------------- |
| **GET**    | `/api/assignments`      | None                                        | Returns a summary of all assignment logs.                         | `200 OK`         |
| **POST**   | `/api/assignments`      | `title`, `description`, `status`, `dueDate` | Adds a new assignment. `assignmentDate` is auto-generated.        | `201 Created`    |
| **GET**    | `/api/assignments/[id]` | None                                        | Returns the full details of a specific assignment.                | `200 OK`         |
| **PUT**    | `/api/assignments/[id]` | `title`, `description`, `status`, `dueDate` | Updates an existing assignment. ID and Create Date are protected. | `200 OK`         |
| **DELETE** | `/api/assignments/[id]` | None                                        | Removes the assignment from the list.                             | `204 No Content` |
