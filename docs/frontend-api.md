# Unevee Fitness API → Frontend Reference

This guide documents the public REST endpoints exposed by the NestJS backend. Share it with frontend engineers so everyone has the same expectations for request payloads, responses, pagination, and error codes.

---

## Base URLs & Versioning

- **Production**: `https://unevee-bakend.onrender.com`
- **Local**: `http://localhost:3000`
- All APIs are currently **public** – no auth headers required.
- Versioning is planned; for now the routes sit under the root (`/programs`, `/workouts`, `/diets`).

---

## Common Behaviors

- **Pagination**  
  Any `GET` list endpoint supports `page` and `limit` query params. Defaults: `page=1`, `limit=10`, maximum limit is 100. Response includes `{ data, total, page, limit }`.

- **Validation & Errors**  
  Our global validation pipe whitelists payload properties. Sending unknown fields returns `400` with:
  ```json
  {
    "statusCode": 400,
    "message": ["property someField should not exist"],
    "error": "Bad Request"
  }
  ```

- **Identifiers**  
  - `_id`: MongoDB ObjectId.  
  - `program_id`, `diet_id`: external string IDs generated elsewhere (programs) or by the service (diets).  
  - Detail routes accept `_id` **or** the feature-specific id/slug (see endpoint notes).

---

## Programs API

### GET `/programs`
- **Description**: Fetch paginated list of fitness programs.
- **Query Params**
  | Param | Type | Default | Notes |
  |-------|------|---------|-------|
  | `page` | number | 1 | page index |
  | `limit` | number | 10 | max 100 |
- **Sample Request**
  ```
  GET /programs?page=1&limit=5
  ```
- **Sample Response**
  ```json
  {
    "data": [
      {
        "_id": "68f4edba23c128edae452893",
        "program_id": "01K7Y4B8643G43R5F0SKX19V65",
        "title": "New Example Program",
        "slug": "new-example-program",
        "duration_days": 3,
        "difficulty_level": "Beginner",
        "primary_goal": "Example Goal",
        "category": ["Full Body"],
        "target_audience": ["Beginners"],
        "days": [
          {
            "day_number": 1,
            "workouts": [
              {
                "workout_id": "01K7Y44HRV5E6AXST9ADWBKRPS",
                "title": "Band Bent-Over Rear Lateral Raise",
                "duration_minutes": 10,
                "order_in_day": 1,
                "tags": ["Shoulders", "Core"],
                "exercises": [
                  {
                    "exercise_id": "01K7Y44HRV5E6AXST9ADWBKRPS_ex_0",
                    "name": "Setup Position",
                    "sets": 1,
                    "instructions": [
                      "Stand with your feet shoulder-width apart..."
                    ]
                  }
                ]
              }
            ]
          }
        ],
        "total_workouts": 4,
        "total_exercises": 20,
        "stats": {
          "views": 0,
          "enrollments": 0,
          "completions": 0,
          "avg_rating": 0
        },
        "thumbnail_url": "https://unevee-workouts.s3....png",
        "createdAt": "2025-06-19T11:00:45.643Z",
        "updatedAt": "2025-06-19T11:01:31.035Z"
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 5
  }
  ```

### GET `/programs/:idOrSlug`
- **Description**: Fetch a single program by Mongo `_id`, `program_id`, or `slug`.
- **Examples**
  - `GET /programs/68f4edba23c128edae452893`
  - `GET /programs/01K7Y4B8643G43R5F0SKX19V65`
  - `GET /programs/new-example-program`
- **Response**: Same shape as the single `data` item shown above.
- **Error Codes**
  - `404` if no matching record.

---

## Workouts API

### GET `/workouts`
- **Description**: Paginated list of workouts.
- **Query Params**: `page`, `limit`.
- **Sample Response**
  ```json
  {
    "data": [
      {
        "_id": "68f4e53d23c128edae452891",
        "uid": "01K7XVSSJ73RQA88CBVG31M5NZ",
        "slug": "45-degree-bicycle-twisting-crunch",
        "title": "45-Degree Bicycle Twisting Crunch",
        "description": "This exercise targets your abs...",
        "taxonomy": {
          "category": { "id": "cat_01", "name": "Abs", "slug": "abs" },
          "type": { "id": "type_all", "name": "All", "slug": "all" }
        },
        "difficulty": "Medium",
        "duration_minutes": 10,
        "equipment_needed": ["HyperextensionBench"],
        "primary_muscles": ["Abs"],
        "secondary_muscles": ["Abs", "Hips", "Lower Back", "Quadriceps"],
        "tags": "Abs, Core, Strength",
        "status": "published",
        "stats": { "views": 0, "completions": 0, "favorites": 0, "avg_rating": 0 },
        "media": {
          "variants": [
            {
              "variant": "male",
              "processing_status": "complete",
              "available_resolutions": ["source"],
              "mp4_keys": [
                "dev/unevee/workouts/.../male/.../original.mp4"
              ],
              "captions": []
            }
          ]
        },
        "instructions": [
          {
            "step_number": 1,
            "title": "Setup Position",
            "description": "Sit on the floor ..."
          }
        ],
        "audit": {
          "org_id": "unevee",
          "created_by": "admin@unevee.com",
          "env": "dev"
        },
        "createdAt": "2025-06-18T09:14:10.344Z",
        "updatedAt": "2025-06-18T09:14:10.344Z"
      }
    ],
    "total": 120,
    "page": 1,
    "limit": 10
  }
  ```

### GET `/workouts/:idOrSlug`
- Accepts Mongo `_id`, `uid`, or `slug`.
- Returns the same object shape as the list response.
- Errors: `404` if not found.

### PATCH `/workouts/:id/stats`
- **Description**: Increment workout stats atomically.
- **Body**
  ```json
  {
    "views": 1,
    "completions": 0,
    "favorites": 1,
    "avg_rating": 0
  }
  ```
  All fields optional, but at least one must be present. Values are **increments** (positive integers/floats).
- **Sample Response**
  ```json
  {
    "_id": "68f4e53d23c128edae452891",
    "uid": "01K7XVSSJ73RQA88CBVG31M5NZ",
    "stats": {
      "views": 12,
      "completions": 3,
      "favorites": 5,
      "avg_rating": 4.2
    },
    "...": "other workout fields"
  }
  ```
- **Error Codes**
  - `400` if body empty or ids invalid.
  - `404` if workout missing.

---

## Diets API

### POST `/diets`
- **Description**: Create a diet plan. Generates `diet_id` and `slug` automatically (unless you supply a slug).
- **Required fields**: `org_id`, `title`.
- **Sample Payload**
  ```json
  {
    "org_id": "org_123",
    "partner_id": "partner_456",
    "title": "7-Day Keto Diet",
    "description": "Low-carb plan for fat loss.",
    "duration_days": 7,
    "difficulty_level": "Intermediate",
    "primary_goal": "Weight Loss",
    "calories_per_day": 1800,
    "macros": { "protein": 150, "carbs": 50, "fats": 120 },
    "meals": [
      {
        "day_number": 1,
        "meals": [
          {
            "meal_type": "Breakfast",
            "name": "Avocado Egg Scramble",
            "ingredients": ["2 eggs", "1 avocado"],
            "calories": 400,
            "macros": { "protein": 20, "carbs": 10, "fats": 35 },
            "instructions": ["Scramble eggs with avocado."]
          }
        ]
      }
    ],
    "assigned_to": ["user_789"],
    "status": "draft",
    "is_featured": false,
    "tags": ["keto", "weight loss"]
  }
  ```
- **Sample Response**
  ```json
  {
    "_id": "68f5aa5e23c128edae452920",
    "diet_id": "4a0b9c76-3f0f-4f27-bf18-7a6b4ad04f47",
    "slug": "7-day-keto-diet",
    "org_id": "org_123",
    "partner_id": "partner_456",
    "title": "7-Day Keto Diet",
    "description": "Low-carb plan for fat loss.",
    "duration_days": 7,
    "calories_per_day": 1800,
    "macros": { "protein": 150, "carbs": 50, "fats": 120 },
    "meals": [
      {
        "day_number": 1,
        "meals": [
          {
            "meal_type": "Breakfast",
            "name": "Avocado Egg Scramble",
            "ingredients": ["2 eggs", "1 avocado"],
            "calories": 400,
            "macros": { "protein": 20, "carbs": 10, "fats": 35 },
            "instructions": ["Scramble eggs with avocado."]
          }
        ]
      }
    ],
    "assigned_to": ["user_789"],
    "status": "draft",
    "is_featured": false,
    "tags": ["keto", "weight loss"],
    "stats": {
      "views": 0,
      "completions": 0,
      "favorites": 0,
      "avg_rating": 0
    },
    "audit": { "env": "dev" },
    "createdAt": "2025-06-20T08:12:04.321Z",
    "updatedAt": "2025-06-20T08:12:04.321Z",
    "__v": 0
  }
  ```
- **Errors**
  - `400` for validation issues (missing `org_id`/`title`, negative numbers, etc.).
  - `409` if `slug` or generated `diet_id` collides (rare).

### GET `/diets`
- **Description**: Paginated list of diets, optional org filter.
- **Query Params**
  | Param | Type | Notes |
  |-------|------|-------|
  | `page` | number | pagination |
  | `limit` | number | pagination |
  | `orgId` | string | filter by organization |

- **Response**
  ```json
  {
    "data": [
      {
        "_id": "68f5aa5e23c128edae452920",
        "diet_id": "4a0b9c76-3f0f-4f27-bf18-7a6b4ad04f47",
        "org_id": "org_123",
        "title": "7-Day Keto Diet",
        "status": "draft",
        "is_featured": false,
        "tags": ["keto", "weight loss"],
        "macros": { "protein": 150, "carbs": 50, "fats": 120 },
        "meals": [ ... ],
        "stats": { "views": 0, "completions": 0, "favorites": 0, "avg_rating": 0 },
        "createdAt": "2025-06-20T08:12:04.321Z",
        "updatedAt": "2025-06-20T08:12:04.321Z"
      }
    ],
    "total": 8,
    "page": 1,
    "limit": 10
  }
  ```

### GET `/organization/:orgId/diets`
- Same response as `/diets`, but `orgId` is taken from the path. Useful for org-scoped pages:
  ```
  GET /organization/org_123/diets?page=1&limit=6
  ```

### GET `/diets/:identifier`
- Accepts Mongo `_id`, `diet_id`, or `slug`.
- Optional query param `orgId` to pin to an organisation.
  ```
  GET /diets/68f5aa5e23c128edae452920?orgId=org_123
  GET /diets/4a0b9c76-3f0f-4f27-bf18-7a6b4ad04f47
  GET /diets/7-day-keto-diet-20250101T120000123
  ```
- Returns full diet document; `404` if missing.

### PUT `/diets/:id`
- Replace diet content (send the full document). Mainly used for admin flows.
- Same payload structure as `POST /diets`. Returns updated object.

### PATCH `/diets/:id`
- Partial updates. Send only fields to change.
- Example (mark diet published & featured):
  ```json
  {
    "status": "published",
    "is_featured": true
  }
  ```
- Response: updated diet document.

---

## Error Cheat Sheet

| Status | Meaning | Common Causes |
|--------|---------|---------------|
| `400`  | Bad request | Invalid ObjectId, missing required fields, unexpected payload properties |
| `404`  | Not found | No record matched the provided id/slug/filters |
| `409`  | Conflict | Unique index collision on diet slug/diet_id |
| `500`  | Server error | Unexpected exceptions (check server logs) |

Error shape example:
```json
{
  "statusCode": 404,
  "message": "Program not found",
  "error": "Not Found"
}
```

---

## Tips For Frontend Integration

1. **Always log pagination metadata** – you’ll need it for infinite scroll or next-page buttons.
2. **Treat stats as read-only** except via the dedicated stats endpoints (e.g., `PATCH /workouts/:id/stats`).
3. **Slug support** – detail endpoints for programs, workouts, and diets accept both `_id` and slug/external ids; use whichever your routing prefers.
4. **Diet slugs** – service auto-appends a timestamp suffix when generating slugs to keep them unique; store the slug from the response rather than re-computing it on the client.
5. **Diet editing flows** – prefer `PATCH` for simple status toggles, `PUT` only when replacing the full payload.
6. **Optimistic UI** – if you optimistically increment stats on the client, still call the backend so the database stays accurate.

Need another endpoint or field documented? Ping the backend team; we’ll update this doc as features grow.
