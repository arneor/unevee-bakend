# Unevee Fitness API

NestJS backend that powers a public-facing fitness experience for programs, workouts, and diets. The service is designed for MongoDB using Mongoose schemas that mirror existing data collections, and ships with modular endpoints and DTO-driven validation ready for future expansion (auth, rate limiting, caching).

---

## Stack & Key Packages

- Node.js / NestJS 11
- MongoDB via `@nestjs/mongoose` and `mongoose`
- DTO validation with `class-validator`, `class-transformer`, and global `ValidationPipe`
- UUID-based identifie
  rs for new diet plans (`crypto.randomUUID`)

---

## Project Structure (src)

- `app.module.ts` – Bootstraps Mongo connection, registers feature modules.
- `main.ts` – Enables global validation pipe (transform & whitelist).
- `common/dto/pagination-query.dto.ts` – Shared pagination query DTO.
- `programs/` – Program module, schema, controller & service (read-only).
- `workouts/` – Workout module including stats increment endpoint.
- `diets/` – Diet module with create/list/update APIs and nested schemas.

Each feature module follows NestJS best practices (module → controller → service → schemas/DTOs).

---

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**
   - Copy `.env.example` (or create `.env` manually) and set:
     ```
     MONGODB_URI=mongodb://localhost:27017/amata2_dev
     PORT=3000
     ```
   - `MONGODB_URI` points to the MongoDB replica containing `programs`, `workouts`, and the new `diets` collection.

3. **Run the app**
   ```bash
   npm run start:dev
   ```
   The API listens at `http://localhost:3000` by default.

---

## MongoDB Schemas (High-Level)

| Collection | Highlights                                                                                                                                  |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `programs` | Nested `days[] -> workouts[] -> exercises[]`, stats block, audit metadata, taxonomy structure. Read-only endpoints mirror existing objects. |
| `workouts` | Rich taxonomy, media variants, instructions, and stats object. Stats updates performed with atomic `$inc`.                                  |
| `diets`    | Org-scoped diet plans with macros, meals per day, assignment list, default stats, audit info, and indexes on `org_id`, `diet_id`, `slug`.   |

All schemas enable timestamps (`createdAt`, `updatedAt`) and default number fields to `0` for consistency with existing data.

---

## API Reference & Manual Testing

Use Postman, Thunder Client, or `curl` examples below. All endpoints return JSON and use query parameters for pagination (`page`, `limit`, optional `orgId` for diets).

### Programs

#### List programs

- **Method / Path**: `GET /programs`
- **Query params**:
  - `page` (optional, default `1`)
  - `limit` (optional, default `10`, max `100`)
- **Test with curl**
  ```bash
  curl -X GET "http://localhost:3000/programs?page=1&limit=10"
  ```
- **Response**
  ```json
  {
    "data": [ { "_id": "...", "program_id": "...", "title": "...", ... } ],
    "total": 42,
    "page": 1,
    "limit": 10
  }
  ```

#### Get program by id

- **Method / Path**: `GET /programs/:id`
- **Path param**: Mongo `_id`
- **Test with curl**
  ```bash
  curl -X GET "http://localhost:3000/programs/68f4e56c23c128edae452892"
  ```
- **Errors**: `400` for invalid ObjectId, `404` if not found.

### Workouts

#### List workouts

- **Method / Path**: `GET /workouts`
- **Query params**: `page`, `limit` (same as programs)
- **Test with curl**
  ```bash
  curl -X GET "http://localhost:3000/workouts?page=1&limit=10"
  ```

#### Get workout by id

- **Method / Path**: `GET /workouts/:id`
- **Test with curl**
  ```bash
  curl -X GET "http://localhost:3000/workouts/68f4e53d23c128edae452891"
  ```

#### Increment workout stats

- **Method / Path**: `PATCH /workouts/:id/stats`
- **Body**: Provide positive increments for any stat (`views`, `completions`, `favorites`, `avg_rating`).
- **Test with curl**
  ```bash
  curl -X PATCH "http://localhost:3000/workouts/68f4e53d23c128edae452891/stats" \
    -H "Content-Type: application/json" \
    -d '{ "views": 1, "favorites": 1 }'
  ```
- **Behavior**: Atomic `$inc` update; values must be numeric and ≥ 0. Returns the updated workout document.

### Diets

#### Create a diet

- **Method / Path**: `POST /diets`
- **Body**: Must include `org_id`, `title`; slug auto-generated when omitted; `diet_id` generated server-side.
- **Sample payload**
  ```json
  {
    "org_id": "org_123",
    "title": "7-Day Keto Diet",
    "description": "Low-carb plan for fat loss",
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
    "tags": ["keto", "weight loss"]
  }
  ```
- **Test with curl**
  ```bash
  curl -X POST "http://localhost:3000/diets" \
    -H "Content-Type: application/json" \
    -d @diet.json
  ```

#### List diets (global)

- **Method / Path**: `GET /diets`
- **Query params**:
  - `page`, `limit`
  - `orgId` (optional filter)
- **Test with curl**
  ```bash
  curl -X GET "http://localhost:3000/diets?page=1&limit=10&orgId=org_123"
  ```

#### List diets by organization path

- **Method / Path**: `GET /organization/:orgId/diets`
- **Query params**: `page`, `limit`
- **Test with curl**
  ```bash
  curl -X GET "http://localhost:3000/organization/org_123/diets?page=1&limit=5"
  ```

#### Get diet by id

- **Method / Path**: `GET /diets/:id`
- **Test with curl**
  ```bash
  curl -X GET "http://localhost:3000/diets/68f4e56c23c128edae452999"
  ```

#### Update diet (full or partial)

- **Method / Path**:
  - `PUT /diets/:id` (replace)
  - `PATCH /diets/:id` (partial)
- **Body**: Same schema as `CreateDietDto`; omit properties you do not want to change when using `PATCH`.
- **Test with curl (PATCH)**
  ```bash
  curl -X PATCH "http://localhost:3000/diets/68f4e56c23c128edae452999" \
    -H "Content-Type: application/json" \
    -d '{ "status": "published", "is_featured": true }'
  ```

---

## Validation & Error Handling

- Global `ValidationPipe` enforces DTO rules (type coercion, whitelisting, disallowing unknown payload properties).
- Invalid ObjectId parameters return `400 Bad Request`.
- Missing resources return `404 Not Found`.
- Duplicate diet `slug`/`diet_id` violations return `409 Conflict`.

---

## Recommended Testing Flow

1. **Seed / verify MongoDB data**: ensure `programs` and `workouts` collections contain the provided sample data; create diets through API.
2. **Run backend**: `npm run start:dev`.
3. **Exercise endpoints**:
   - Use the curl commands above or import them into Postman.
   - Verify pagination metadata (`page`, `limit`, `total`) on list endpoints.
   - Confirm `PATCH /workouts/:id/stats` increments values by inspecting MongoDB documents.
   - Create a diet, list with `GET /diets`, fetch it by id, update status, and confirm fields changed.
4. **Check logs / errors**: the service throws descriptive HTTP exceptions for faster debugging.

---

## Future Enhancements (Non-breaking)

- Introduce authentication & authorization guards (e.g., JWT) as APIs transition from public to protected.
- Add caching (Redis) around heavy list endpoints.
- Extend diets with soft-delete support and historical tracking.
- Add E2E tests under `test/` when business logic stabilizes.

---

## Scripts

```bash
npm run start         # start once
npm run start:dev     # watch mode
npm run build         # compile to dist/
```

Happy building! Feel free to adapt the models and controllers as private APIs, guards, and caching come online.
