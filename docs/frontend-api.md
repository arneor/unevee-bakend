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

- **Filtering**
  List endpoints support additional filtering query params for more targeted results:
  - Programs: `difficulty_level`, `min_duration`, `max_duration`
  - Workouts: `difficulty`, `min_duration`, `max_duration`
  - Diets: `orgId`, `difficulty_level`, `min_calories`, `max_calories`

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
  | `difficulty_level` | string | - | filter by difficulty (e.g., "Beginner", "Intermediate", "Advanced") |
  | `min_duration` | number | - | minimum program duration in days |
  | `max_duration` | number | - | maximum program duration in days |
- **Sample Requests**
  ```
  GET /programs?page=1&limit=5
  GET /programs?difficulty_level=Beginner&min_duration=7&max_duration=30
  ```
- **Sample Response**
  ```json
  {
    "data": [
      {
        "_id": "68f4ce3d370bda6e2e98d4b8",
        "program_id": "01K7Y4B8643G43R5F0SKX19V65",
        "title": "New Exmple Program",
        "description": "This is the Example of the program ",
        "slug": "new-exmple-program",
        "duration_days": 3,
        "difficulty_level": "Beginner",
        "primary_goal": "Exmple Goal",
        "category": ["Full Body"],
        "target_audience": ["Beginners"],
        "days": [
          {
            "day_number": 1,
            "workouts": [
              {
                "workout_id": "01K7Y44HRV5E6AXST9ADWBKRPS",
                "title": "Band Bent-Over Rear Lateral Raise",
                "description": "The Band Bent-Over Rear Lateral Raise is an isolation exercise that targets the rear deltoids (back part of your shoulders) using resistance bands. It helps improve shoulder balance, posture, and upper back definition. This movement is great for strengthening the smaller stabilizing muscles of the shoulders and preventing imbalance caused by front-dominant training.",
                "thumbnail_url": "",
                "video_url": "dev/unevee/workouts/01K7Y44HRV5E6AXST9ADWBKRPS/male/cat_08-shoulders/type_all-all/source/original.mp4",
                "duration_minutes": 10,
                "difficulty_level": "Medium",
                "category": "Shoulders",
                "goal": "All",
                "equipment_required": ["CableCrossoverMachine"],
                "target_muscles": ["Shoulders", "Shoulders"],
                "calories_burned": 0,
                "exercises": [
                  {
                    "exercise_id": "01K7Y44HRV5E6AXST9ADWBKRPS_ex_0",
                    "name": "Setup Position",
                    "sets": 1,
                    "reps": 0,
                    "duration_seconds": 0,
                    "rest_seconds": 0,
                    "instructions": [
                      "Stand with your feet shoulder-width apart and place a resistance band under your feet. Hold one end of the band in each hand using a neutral grip (palms facing each other)."
                    ],
                    "tips": []
                  },
                  {
                    "exercise_id": "01K7Y44HRV5E6AXST9ADWBKRPS_ex_1",
                    "name": "Body Alignment",
                    "sets": 1,
                    "reps": 0,
                    "duration_seconds": 0,
                    "rest_seconds": 0,
                    "instructions": [
                      "Bend your knees slightly and hinge forward at your hips until your torso is almost parallel to the ground. Keep your back straight and your core tight."
                    ],
                    "tips": []
                  },
                  {
                    "exercise_id": "01K7Y44HRV5E6AXST9ADWBKRPS_ex_2",
                    "name": "Start the Movement",
                    "sets": 1,
                    "reps": 0,
                    "duration_seconds": 0,
                    "rest_seconds": 0,
                    "instructions": [
                      "With a slight bend in your elbows, raise your arms outward to the sides until they are in line with your shoulders. Focus on squeezing your rear delts and upper back at the top."
                    ],
                    "tips": []
                  },
                  {
                    "exercise_id": "01K7Y44HRV5E6AXST9ADWBKRPS_ex_3",
                    "name": "Lower with Control",
                    "sets": 1,
                    "reps": 0,
                    "duration_seconds": 0,
                    "rest_seconds": 0,
                    "instructions": [
                      "Slowly bring your arms back down to the starting position while keeping constant tension on the bands—don’t let them snap."
                    ],
                    "tips": []
                  },
                  {
                    "exercise_id": "01K7Y44HRV5E6AXST9ADWBKRPS_ex_4",
                    "name": "Breathing and Focus",
                    "sets": 1,
                    "reps": 0,
                    "duration_seconds": 0,
                    "rest_seconds": 0,
                    "instructions": [
                      "Exhale as you raise your arms, inhale as you lower them. Maintain a slow, controlled rhythm throughout the exercise."
                    ],
                    "tips": []
                  }
                ],
                "tags": ["Shoulders", "Core"],
                "status": "published",
                "is_public": false,
                "order_in_day": 1
              }
            ]
          },
          {
            "day_number": 2,
            "workouts": [
              {
                "workout_id": "01K7XWAZF8PSMW53D5RV868DFJ",
                "title": "45-Degree Hyperextension",
                "description": "The 45-Degree Hyperextension is a strength exercise that targets your lower back, glutes, and hamstrings. It’s performed on a hyperextension bench set at a 45° angle, helping improve posterior chain strength, spinal stability, and core endurance. This movement is excellent for developing a strong, balanced lower back and preventing posture-related issues.",
                "thumbnail_url": "",
                "video_url": "dev/unevee/workouts/01K7XWAZF8PSMW53D5RV868DFJ/male/cat_02-back/type_all-all/source/original.mp4",
                "duration_minutes": 10,
                "difficulty_level": "Medium",
                "category": "Back",
                "goal": "All",
                "equipment_required": [],
                "target_muscles": ["Lower Back", "Hips", "Hamstrings"],
                "calories_burned": 0,
                "exercises": [
                  {
                    "exercise_id": "01K7XWAZF8PSMW53D5RV868DFJ_ex_0",
                    "name": "Setup Position",
                    "sets": 1,
                    "reps": 0,
                    "duration_seconds": 0,
                    "rest_seconds": 0,
                    "instructions": [
                      "Adjust the hyperextension bench so your upper thighs rest comfortably on the pad and your feet are secured under the foot supports. Cross your arms over your chest or place your hands lightly behind your head."
                    ],
                    "tips": []
                  },
                  {
                    "exercise_id": "01K7XWAZF8PSMW53D5RV868DFJ_ex_1",
                    "name": "Start Alignment",
                    "sets": 1,
                    "reps": 0,
                    "duration_seconds": 0,
                    "rest_seconds": 0,
                    "instructions": [
                      "Keep your body straight from head to heels. Engage your core and glutes before starting the movement."
                    ],
                    "tips": []
                  },
                  {
                    "exercise_id": "01K7XWAZF8PSMW53D5RV868DFJ_ex_2",
                    "name": "Lower the Torso",
                    "sets": 1,
                    "reps": 0,
                    "duration_seconds": 0,
                    "rest_seconds": 0,
                    "instructions": [
                      "Slowly bend forward at the hips, lowering your upper body until you feel a gentle stretch in your hamstrings. Keep your back neutral and avoid rounding your spine."
                    ],
                    "tips": []
                  },
                  {
                    "exercise_id": "01K7XWAZF8PSMW53D5RV868DFJ_ex_3",
                    "name": "Raise and Contract",
                    "sets": 1,
                    "reps": 0,
                    "duration_seconds": 0,
                    "rest_seconds": 0,
                    "instructions": [
                      "Lift your torso back up by squeezing your glutes and lower back until your body is straight in line with your legs. Avoid hyperextending at the top."
                    ],
                    "tips": []
                  },
                  {
                    "exercise_id": "01K7XWAZF8PSMW53D5RV868DFJ_ex_4",
                    "name": "Breathing and Control",
                    "sets": 1,
                    "reps": 0,
                    "duration_seconds": 0,
                    "rest_seconds": 0,
                    "instructions": [
                      "Inhale as you lower down, and exhale as you raise your torso. Move in a slow, controlled motion throughout."
                    ],
                    "tips": []
                  }
                ],
                "tags": ["Back", "Strength", "Core"],
                "status": "published",
                "is_public": false,
                "order_in_day": 1
              }
            ]
          },
          {
            "day_number": 3,
            "workouts": [
              {
                "workout_id": "01K7Y29P0738DTVJRGC0KQD8V3",
                "title": "Band High Fly",
                "description": "The Band High Fly is an isolation exercise that targets the upper chest and front shoulders using resistance bands. It mimics the cable crossover motion but with bands, helping you build chest definition, stability, and control. It’s ideal for home or gym workouts and can be performed standing or kneeling.",
                "thumbnail_url": "",
                "video_url": "dev/unevee/workouts/01K7Y29P0738DTVJRGC0KQD8V3/male/cat_05-chest/type_all-all/source/original.mp4",
                "duration_minutes": 10,
                "difficulty_level": "Medium",
                "category": "Chest",
                "goal": "All",
                "equipment_required": ["CableCrossoverMachine"],
                "target_muscles": ["Upper Chest", "Shoulders", "Biceps"],
                "calories_burned": 0,
                "exercises": [
                  {
                    "exercise_id": "01K7Y29P0738DTVJRGC0KQD8V3_ex_0",
                    "name": "Setup Position",
                    "sets": 1,
                    "reps": 0,
                    "duration_seconds": 0,
                    "rest_seconds": 0,
                    "instructions": [
                      "Attach the resistance bands above shoulder height on a sturdy anchor point (like a door or pole). Stand in the middle of the bands, holding one handle in each hand"
                    ],
                    "tips": []
                  },
                  {
                    "exercise_id": "01K7Y29P0738DTVJRGC0KQD8V3_ex_1",
                    "name": "Body Alignment",
                    "sets": 1,
                    "reps": 0,
                    "duration_seconds": 0,
                    "rest_seconds": 0,
                    "instructions": [
                      "Step slightly forward to create tension in the bands. Keep your feet staggered, chest up, core tight, and arms extended slightly below shoulder height."
                    ],
                    "tips": []
                  },
                  {
                    "exercise_id": "01K7Y29P0738DTVJRGC0KQD8V3_ex_2",
                    "name": "Start the Movement",
                    "sets": 1,
                    "reps": 0,
                    "duration_seconds": 0,
                    "rest_seconds": 0,
                    "instructions": [
                      "With a slight bend in your elbows, bring both hands downward and together in front of your chest in a smooth arc motion. Focus on squeezing your upper chest at the bottom."
                    ],
                    "tips": []
                  },
                  {
                    "exercise_id": "01K7Y29P0738DTVJRGC0KQD8V3_ex_3",
                    "name": "Return with Control",
                    "sets": 1,
                    "reps": 0,
                    "duration_seconds": 0,
                    "rest_seconds": 0,
                    "instructions": [
                      "Slowly allow your arms to return to the starting position while maintaining tension in the bands—don’t let them snap back."
                    ],
                    "tips": []
                  },
                  {
                    "exercise_id": "01K7Y29P0738DTVJRGC0KQD8V3_ex_4",
                    "name": "Breathing and Focus",
                    "sets": 1,
                    "reps": 0,
                    "duration_seconds": 0,
                    "rest_seconds": 0,
                    "instructions": [
                      "Exhale as you bring the bands together, inhale as you return to start. Keep your chest lifted and movements controlled throughout."
                    ],
                    "tips": []
                  }
                ],
                "tags": ["Strength", "Core", "Chest"],
                "status": "published",
                "is_public": false,
                "order_in_day": 1
              },
              {
                "workout_id": "01K7Y44HRV5E6AXST9ADWBKRPS",
                "title": "Band Bent-Over Rear Lateral Raise",
                "description": "The Band Bent-Over Rear Lateral Raise is an isolation exercise that targets the rear deltoids (back part of your shoulders) using resistance bands. It helps improve shoulder balance, posture, and upper back definition. This movement is great for strengthening the smaller stabilizing muscles of the shoulders and preventing imbalance caused by front-dominant training.",
                "thumbnail_url": "",
                "video_url": "dev/unevee/workouts/01K7Y44HRV5E6AXST9ADWBKRPS/male/cat_08-shoulders/type_all-all/source/original.mp4",
                "duration_minutes": 10,
                "difficulty_level": "Medium",
                "category": "Shoulders",
                "goal": "All",
                "equipment_required": ["CableCrossoverMachine"],
                "target_muscles": ["Shoulders", "Shoulders"],
                "calories_burned": 0,
                "exercises": [
                  {
                    "exercise_id": "01K7Y44HRV5E6AXST9ADWBKRPS_ex_0",
                    "name": "Setup Position",
                    "sets": 1,
                    "reps": 0,
                    "duration_seconds": 0,
                    "rest_seconds": 0,
                    "instructions": [
                      "Stand with your feet shoulder-width apart and place a resistance band under your feet. Hold one end of the band in each hand using a neutral grip (palms facing each other)."
                    ],
                    "tips": []
                  },
                  {
                    "exercise_id": "01K7Y44HRV5E6AXST9ADWBKRPS_ex_1",
                    "name": "Body Alignment",
                    "sets": 1,
                    "reps": 0,
                    "duration_seconds": 0,
                    "rest_seconds": 0,
                    "instructions": [
                      "Bend your knees slightly and hinge forward at your hips until your torso is almost parallel to the ground. Keep your back straight and your core tight."
                    ],
                    "tips": []
                  },
                  {
                    "exercise_id": "01K7Y44HRV5E6AXST9ADWBKRPS_ex_2",
                    "name": "Start the Movement",
                    "sets": 1,
                    "reps": 0,
                    "duration_seconds": 0,
                    "rest_seconds": 0,
                    "instructions": [
                      "With a slight bend in your elbows, raise your arms outward to the sides until they are in line with your shoulders. Focus on squeezing your rear delts and upper back at the top."
                    ],
                    "tips": []
                  },
                  {
                    "exercise_id": "01K7Y44HRV5E6AXST9ADWBKRPS_ex_3",
                    "name": "Lower with Control",
                    "sets": 1,
                    "reps": 0,
                    "duration_seconds": 0,
                    "rest_seconds": 0,
                    "instructions": [
                      "Slowly bring your arms back down to the starting position while keeping constant tension on the bands—don’t let them snap."
                    ],
                    "tips": []
                  },
                  {
                    "exercise_id": "01K7Y44HRV5E6AXST9ADWBKRPS_ex_4",
                    "name": "Breathing and Focus",
                    "sets": 1,
                    "reps": 0,
                    "duration_seconds": 0,
                    "rest_seconds": 0,
                    "instructions": [
                      "Exhale as you raise your arms, inhale as you lower them. Maintain a slow, controlled rhythm throughout the exercise."
                    ],
                    "tips": []
                  }
                ],
                "tags": ["Shoulders", "Core"],
                "status": "published",
                "is_public": false,
                "order_in_day": 2
              }
            ]
          }
        ],
        "total_workouts": 4,
        "total_exercises": 20,
        "estimated_total_calories": 0,
        "status": "published",
        "is_public": true,
        "tags": ["Strength"],
        "stats": {
          "views": 0,
          "enrollments": 0,
          "completions": 0,
          "avg_rating": 0
        },
        "audit": {
          "env": "dev",
          "updated_by": "system"
        },
        "createdAt": "2025-10-19T11:40:45.643Z",
        "updatedAt": "2025-10-19T11:41:31.035Z",
        "__v": 6,
        "thumbnail_url": "https://unevee-workouts.s3.ap-south-1.amazonaws.com/programs/thumbnails/01K7Y4B8643G43R5F0SKX19V65-1760874046652.png"
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
- **Query Params**
  | Param | Type | Default | Notes |
  |-------|------|---------|-------|
  | `page` | number | 1 | pagination |
  | `limit` | number | 10 | pagination |
  | `difficulty` | string | - | filter by difficulty level |
  | `min_duration` | number | - | minimum duration in minutes |
  | `max_duration` | number | - | maximum duration in minutes |
- **Sample Requests**
  ```
  GET /workouts?page=1&limit=10
  GET /workouts?difficulty=Beginner&min_duration=5&max_duration=30
  ```
- **Sample Response**
  ```json
  {
    "data": [
      {
        "_id": "68f4cdc6370bda6e2e98d4ad",
        "uid": "01K7Y44HRV5E6AXST9ADWBKRPS",
        "slug": "band-bent-over-rear-lateral-raise",
        "schema_version": "1.1",
        "title": "Band Bent-Over Rear Lateral Raise",
        "description": "The Band Bent-Over Rear Lateral Raise is an isolation exercise that targets the rear deltoids (back part of your shoulders) using resistance bands. It helps improve shoulder balance, posture, and upper back definition. This movement is great for strengthening the smaller stabilizing muscles of the shoulders and preventing imbalance caused by front-dominant training.",
        "taxonomy": {
          "category": {
            "id": "cat_08",
            "name": "Shoulders",
            "slug": "shoulders"
          },
          "type": {
            "id": "type_all",
            "name": "All",
            "slug": "all"
          }
        },
        "difficulty": "Medium",
        "duration_minutes": 10,
        "equipment_needed": ["CableCrossoverMachine"],
        "primary_muscles": ["Shoulders"],
        "secondary_muscles": ["Shoulders"],
        "tags": "Shoulders, Core",
        "status": "published",
        "is_public": false,
        "available_variants": ["male", "female"],
        "stats": {
          "views": 521,
          "completions": 200,
          "favorites": 53,
          "avg_rating": 30
        },
        "media": {
          "variants": [
            {
              "variant": "male",
              "processing_status": "complete",
              "duration_seconds": null,
              "available_resolutions": ["source"],
              "mp4_keys": [
                "dev/unevee/workouts/01K7Y44HRV5E6AXST9ADWBKRPS/male/cat_08-shoulders/type_all-all/source/original.mp4"
              ],
              "captions": []
            },
            {
              "variant": "female",
              "processing_status": "complete",
              "duration_seconds": null,
              "available_resolutions": ["source"],
              "mp4_keys": [
                "dev/unevee/workouts/01K7Y44HRV5E6AXST9ADWBKRPS/female/cat_08-shoulders/type_all-all/source/original.mp4"
              ],
              "captions": []
            }
          ]
        },
        "instructions": [
          {
            "step_number": 1,
            "title": "Setup Position",
            "description": "Stand with your feet shoulder-width apart and place a resistance band under your feet. Hold one end of the band in each hand using a neutral grip (palms facing each other)."
          },
          {
            "step_number": 2,
            "title": "Body Alignment",
            "description": "Bend your knees slightly and hinge forward at your hips until your torso is almost parallel to the ground. Keep your back straight and your core tight."
          },
          {
            "step_number": 3,
            "title": "Start the Movement",
            "description": "With a slight bend in your elbows, raise your arms outward to the sides until they are in line with your shoulders. Focus on squeezing your rear delts and upper back at the top."
          },
          {
            "step_number": 4,
            "title": "Lower with Control",
            "description": "Slowly bring your arms back down to the starting position while keeping constant tension on the bands—don’t let them snap."
          },
          {
            "step_number": 5,
            "title": "Breathing and Focus",
            "description": "Exhale as you raise your arms, inhale as you lower them. Maintain a slow, controlled rhythm throughout the exercise."
          }
        ],
        "audit": {
          "org_id": "unevee",
          "created_by": "admin@unevee.com",
          "env": "dev"
        },
        "createdAt": "2025-10-19T11:38:46.161Z",
        "updatedAt": "2025-10-19T19:07:14.411Z",
        "__v": 0
      },
      {
        "_id": "68f4c68171078c6788a73410",
        "uid": "01K7Y29P0738DTVJRGC0KQD8V3",
        "slug": "band-high-fly",
        "schema_version": "1.1",
        "title": "Band High Fly",
        "description": "The Band High Fly is an isolation exercise that targets the upper chest and front shoulders using resistance bands. It mimics the cable crossover motion but with bands, helping you build chest definition, stability, and control. It’s ideal for home or gym workouts and can be performed standing or kneeling.",
        "taxonomy": {
          "category": {
            "id": "cat_05",
            "name": "Chest",
            "slug": "chest"
          },
          "type": {
            "id": "type_all",
            "name": "All",
            "slug": "all"
          }
        },
        "difficulty": "Medium",
        "duration_minutes": 10,
        "equipment_needed": ["CableCrossoverMachine"],
        "primary_muscles": ["Upper Chest"],
        "secondary_muscles": ["Shoulders", "Biceps"],
        "tags": "Strength, Core, Chest",
        "status": "published",
        "is_public": false,
        "available_variants": ["male", "female"],
        "stats": {
          "views": 0,
          "completions": 0,
          "favorites": 0,
          "avg_rating": 0
        },
        "media": {
          "variants": [
            {
              "variant": "male",
              "processing_status": "complete",
              "duration_seconds": null,
              "available_resolutions": ["source"],
              "mp4_keys": [
                "dev/unevee/workouts/01K7Y29P0738DTVJRGC0KQD8V3/male/cat_05-chest/type_all-all/source/original.mp4"
              ],
              "captions": []
            },
            {
              "variant": "female",
              "processing_status": "complete",
              "duration_seconds": null,
              "available_resolutions": ["source"],
              "mp4_keys": [
                "dev/unevee/workouts/01K7Y29P0738DTVJRGC0KQD8V3/female/cat_05-chest/type_all-all/source/original.mp4"
              ],
              "captions": []
            }
          ]
        },
        "instructions": [
          {
            "step_number": 1,
            "title": "Setup Position",
            "description": "Attach the resistance bands above shoulder height on a sturdy anchor point (like a door or pole). Stand in the middle of the bands, holding one handle in each hand"
          },
          {
            "step_number": 2,
            "title": "Body Alignment",
            "description": "Step slightly forward to create tension in the bands. Keep your feet staggered, chest up, core tight, and arms extended slightly below shoulder height."
          },
          {
            "step_number": 3,
            "title": "Start the Movement",
            "description": "With a slight bend in your elbows, bring both hands downward and together in front of your chest in a smooth arc motion. Focus on squeezing your upper chest at the bottom."
          },
          {
            "step_number": 4,
            "title": "Return with Control",
            "description": "Slowly allow your arms to return to the starting position while maintaining tension in the bands—don’t let them snap back."
          },
          {
            "step_number": 5,
            "title": "Breathing and Focus",
            "description": "Exhale as you bring the bands together, inhale as you return to start. Keep your chest lifted and movements controlled throughout."
          }
        ],
        "audit": {
          "org_id": "unevee",
          "created_by": "admin@unevee.com",
          "env": "dev"
        },
        "createdAt": "2025-10-19T11:07:45.372Z",
        "updatedAt": "2025-10-19T11:07:45.372Z",
        "__v": 0
      },
      {
        "_id": "68f4b247f4a5d9365f1c7b7b",
        "uid": "01K7XXCVTYDJ6JT2H29BWB7PP8",
        "slug": "barbell-curl",
        "schema_version": "1.1",
        "title": "Barbell Curl",
        "description": "The Barbell Curl is a classic biceps-building exercise that targets the front of your upper arms. It helps improve arm size, strength, and definition, making it one of the most effective movements for upper-body development. Using a barbell allows you to lift heavier weights with stability and build overall arm mass.",
        "taxonomy": {
          "category": {
            "id": "cat_03",
            "name": "Biceps",
            "slug": "biceps"
          },
          "type": {
            "id": "type_all",
            "name": "All",
            "slug": "all"
          }
        },
        "difficulty": "Medium",
        "duration_minutes": 10,
        "equipment_needed": ["LandmineAttatcment"],
        "primary_muscles": ["Biceps"],
        "secondary_muscles": ["Biceps"],
        "tags": "Strength, Biceps, Core",
        "status": "published",
        "is_public": false,
        "available_variants": ["male", "female"],
        "stats": {
          "views": 0,
          "completions": 0,
          "favorites": 0,
          "avg_rating": 0
        },
        "media": {
          "variants": [
            {
              "variant": "male",
              "processing_status": "complete",
              "duration_seconds": null,
              "available_resolutions": ["source"],
              "mp4_keys": [
                "dev/unevee/workouts/01K7XXCVTYDJ6JT2H29BWB7PP8/male/cat_03-biceps/type_all-all/source/original.mp4"
              ],
              "captions": []
            },
            {
              "variant": "female",
              "processing_status": "complete",
              "duration_seconds": null,
              "available_resolutions": ["source"],
              "mp4_keys": [
                "dev/unevee/workouts/01K7XXCVTYDJ6JT2H29BWB7PP8/female/cat_03-biceps/type_all-all/source/original.mp4"
              ],
              "captions": []
            }
          ]
        },
        "instructions": [
          {
            "step_number": 1,
            "title": "Setup Position",
            "description": "Stand upright with your feet shoulder-width apart. Hold a barbell with an underhand grip (palms facing up) at shoulder-width. Keep your elbows close to your torso."
          },
          {
            "step_number": 2,
            "title": "Engage and Stabilize",
            "description": "Tighten your core and keep your shoulders relaxed. Maintain a straight back and avoid swinging your body."
          },
          {
            "step_number": 3,
            "title": "Curl the Bar",
            "description": "Exhale and lift the barbell upward by contracting your biceps. Keep your elbows stationary while bringing the bar toward shoulder level."
          },
          {
            "step_number": 4,
            "title": "Squeeze at the Top",
            "description": "Pause briefly at the top of the curl and squeeze your biceps for maximum contraction."
          },
          {
            "step_number": 5,
            "title": "Lower with Control",
            "description": "Inhale as you slowly lower the barbell back to the starting position, maintaining control throughout the descent."
          }
        ],
        "audit": {
          "org_id": "unevee",
          "created_by": "admin@unevee.com",
          "env": "dev"
        },
        "createdAt": "2025-10-19T09:41:27.467Z",
        "updatedAt": "2025-10-19T09:41:27.467Z",
        "__v": 0
      },
      {
        "_id": "68f4add3f4a5d9365f1c7b40",
        "uid": "01K7XWAZF8PSMW53D5RV868DFJ",
        "slug": "45-degree-hyperextension",
        "schema_version": "1.1",
        "title": "45-Degree Hyperextension",
        "description": "The 45-Degree Hyperextension is a strength exercise that targets your lower back, glutes, and hamstrings. It’s performed on a hyperextension bench set at a 45° angle, helping improve posterior chain strength, spinal stability, and core endurance. This movement is excellent for developing a strong, balanced lower back and preventing posture-related issues.",
        "taxonomy": {
          "category": {
            "id": "cat_02",
            "name": "Back",
            "slug": "back"
          },
          "type": {
            "id": "type_all",
            "name": "All",
            "slug": "all"
          }
        },
        "difficulty": "Medium",
        "duration_minutes": 10,
        "equipment_needed": [],
        "primary_muscles": ["Lower Back"],
        "secondary_muscles": ["Hips", "Hamstrings"],
        "tags": "Back, Strength, Core",
        "status": "published",
        "is_public": false,
        "available_variants": ["male", "female"],
        "stats": {
          "views": 0,
          "completions": 0,
          "favorites": 0,
          "avg_rating": 0
        },
        "media": {
          "variants": [
            {
              "variant": "male",
              "processing_status": "complete",
              "duration_seconds": null,
              "available_resolutions": ["source"],
              "mp4_keys": [
                "dev/unevee/workouts/01K7XWAZF8PSMW53D5RV868DFJ/male/cat_02-back/type_all-all/source/original.mp4"
              ],
              "captions": []
            },
            {
              "variant": "female",
              "processing_status": "complete",
              "duration_seconds": null,
              "available_resolutions": ["source"],
              "mp4_keys": [
                "dev/unevee/workouts/01K7XWAZF8PSMW53D5RV868DFJ/female/cat_02-back/type_all-all/source/original.mp4"
              ],
              "captions": []
            }
          ]
        },
        "instructions": [
          {
            "step_number": 1,
            "title": "Setup Position",
            "description": "Adjust the hyperextension bench so your upper thighs rest comfortably on the pad and your feet are secured under the foot supports. Cross your arms over your chest or place your hands lightly behind your head."
          },
          {
            "step_number": 2,
            "title": "Start Alignment",
            "description": "Keep your body straight from head to heels. Engage your core and glutes before starting the movement."
          },
          {
            "step_number": 3,
            "title": "Lower the Torso",
            "description": "Slowly bend forward at the hips, lowering your upper body until you feel a gentle stretch in your hamstrings. Keep your back neutral and avoid rounding your spine."
          },
          {
            "step_number": 4,
            "title": "Raise and Contract",
            "description": "Lift your torso back up by squeezing your glutes and lower back until your body is straight in line with your legs. Avoid hyperextending at the top."
          },
          {
            "step_number": 5,
            "title": "Breathing and Control",
            "description": "Inhale as you lower down, and exhale as you raise your torso. Move in a slow, controlled motion throughout."
          }
        ],
        "audit": {
          "org_id": "unevee",
          "created_by": "admin@unevee.com",
          "env": "dev"
        },
        "createdAt": "2025-10-19T09:22:27.751Z",
        "updatedAt": "2025-10-19T09:22:27.751Z",
        "__v": 0
      },
      {
        "_id": "68f4abe2f4a5d9365f1c7b34",
        "uid": "01K7XVSSJ73RQA88CBVG31M5NZ",
        "slug": "45-degree-bicycle-twisting-crunch",
        "schema_version": "1.1",
        "title": "45-Degree Bicycle Twisting Crunch",
        "description": "This exercise targets your abs and obliques while improving core strength and stability. Sit slightly back at about a 45-degree angle with your legs lifted off the floor. Move your legs in a pedaling motion like riding a bicycle while twisting your torso—bringing your opposite elbow toward the raised knee. Keep your core tight and control each movement for maximum engagement.",
        "taxonomy": {
          "category": {
            "id": "cat_01",
            "name": "Abs",
            "slug": "abs"
          },
          "type": {
            "id": "type_all",
            "name": "All",
            "slug": "all"
          }
        },
        "difficulty": "Medium",
        "duration_minutes": 10,
        "equipment_needed": ["HyperextensionBench"],
        "primary_muscles": ["Abs"],
        "secondary_muscles": ["Abs", "Hips", "Lower Back", "Quadriceps"],
        "tags": "Abs, Core, Strength",
        "status": "published",
        "is_public": false,
        "available_variants": ["male", "female"],
        "stats": {
          "views": 1,
          "completions": 0,
          "favorites": 1,
          "avg_rating": 0
        },
        "media": {
          "variants": [
            {
              "variant": "male",
              "processing_status": "complete",
              "duration_seconds": null,
              "available_resolutions": ["source"],
              "mp4_keys": [
                "dev/unevee/workouts/01K7XVSSJ73RQA88CBVG31M5NZ/male/cat_01-abs/type_all-all/source/original.mp4"
              ],
              "captions": []
            },
            {
              "variant": "female",
              "processing_status": "complete",
              "duration_seconds": null,
              "available_resolutions": ["source"],
              "mp4_keys": [
                "dev/unevee/workouts/01K7XVSSJ73RQA88CBVG31M5NZ/female/cat_01-abs/type_all-all/source/original.mp4"
              ],
              "captions": []
            }
          ]
        },
        "instructions": [
          {
            "step_number": 1,
            "title": "Setup Position",
            "description": "Sit on the floor with knees bent and feet flat. Lean back to about a 45° angle, keeping your back straight, and place your hands lightly beside your head."
          },
          {
            "step_number": 2,
            "title": "Activate Your Core",
            "description": "Lift both feet slightly off the floor and engage your abdominal muscles to stabilize your body."
          },
          {
            "step_number": 3,
            "title": "Twist and Extend",
            "description": "Bring your right elbow toward your left knee while extending your right leg straight out."
          },
          {
            "step_number": 4,
            "title": "Switch Sides Smoothly",
            "description": "Return to center, then bring your left elbow toward your right knee while extending your left leg. Continue alternating in a controlled, pedaling motion."
          },
          {
            "step_number": 5,
            "title": "Control and Breathe",
            "description": "Move slowly, twisting from your core—not your arms. Exhale when twisting, inhale when returning. Do 2–3 sets of 12–20 reps per side."
          }
        ],
        "audit": {
          "org_id": "unevee",
          "created_by": "admin@unevee.com",
          "env": "dev"
        },
        "createdAt": "2025-10-19T09:14:10.344Z",
        "updatedAt": "2025-10-19T15:22:43.409Z",
        "__v": 0
      }
    ],
    "total": 5,
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
    "branch_id": "partner_456",
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
    "status": "draft",
    "is_public": false,
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
    "branch_id": "branch_456",
    "branch_id": "partner_456",
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
    "status": "draft",
    "is_public": false,
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

- **Description**: Paginated list of diets. When no `orgId` is provided, only public diets (`is_public: true`) are returned. When `orgId` is provided, all diets for that organization are returned.
- **Query Params**
  | Param | Type | Notes |
  |-------|------|-------|
  | `page` | number | pagination |
  | `limit` | number | pagination |
  | `orgId` | string | filter by organization (if not provided, only public diets are returned) |
  | `branchId` | string | filter by branch |
  | `difficulty_level` | string | filter by difficulty level |
  | `min_calories` | number | minimum calories per day |
  | `max_calories` | number | maximum calories per day |
- **Sample Requests**
  ```
  GET /diets?page=1&limit=10 (returns only public diets)
  GET /diets?page=1&limit=10&orgId=org_123 (returns all diets for organization)
  GET /diets?page=1&limit=10&orgId=org_123&branchId=branch_456
  GET /diets?difficulty_level=Beginner&min_calories=1200&max_calories=2000
  GET /diets?orgId=org_123&branchId=branch_456&difficulty_level=Intermediate&min_calories=1500&max_calories=2500
  ```
- **Response**
  ```json
  {
    "data": [
      {
        "_id": "68f5aa5e23c128edae452920",
        "diet_id": "4a0b9c76-3f0f-4f27-bf18-7a6b4ad04f47",
        "org_id": "org_123",
        "branch_id": "branch_456",
        "title": "7-Day Keto Diet",
        "status": "draft",
        "is_public": true,
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
  GET /organization/org_123/diets?page=1&limit=6&branchId=branch_456
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
    "is_public": true
  }
  ```
- Response: updated diet document.

---

## Error Cheat Sheet

| Status | Meaning      | Common Causes                                                            |
| ------ | ------------ | ------------------------------------------------------------------------ |
| `400`  | Bad request  | Invalid ObjectId, missing required fields, unexpected payload properties |
| `404`  | Not found    | No record matched the provided id/slug/filters                           |
| `409`  | Conflict     | Unique index collision on diet slug/diet_id                              |
| `500`  | Server error | Unexpected exceptions (check server logs)                                |

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
