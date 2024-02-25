import express from "express";
const router = express.Router();
import tripsController from "../controllers/trips_controller";
import authMiddleWare from "../common/auth_middleware";

/**
* @swagger
* paths:
*   /trips/:
*     get:
*       summary: Get all trips
*       tags: [Trips]
*       responses:
*         '200':
*           description: A list of all trips
*           content:
*             application/json:
*               schema:
*                 type: array
*                 items:
*                   $ref: '#/components/schemas/Trip'
*         '500':
*           description: Internal server error
*/

router.get("/", tripsController.getAllTrips);

/**
* @swagger
* /trips/{id}:
*   get:
*     summary: Get trips by owner ID
*     tags: [Trips]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*         description: The unique identifier of the user whose trips are being retrieved.
*     security:
*       - bearerAuth: []
*     responses:
*       '200':
*         description: A list of trips for the specified user.
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Trip'
*       '401':
*         description: Unauthorized - User not authenticated.
*       '404':
*         description: No trips found for the specified user ID.
*       '500':
*         description: Internal server error occurred while fetching the trips.
*/

router.get("/:id", authMiddleWare, tripsController.getByOwnerId);

/**
* @swagger
* /trips/trip/{id}:
*   get:
*     summary: Get trip by ID
*     tags: [Trips]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*         description: The unique identifier of the trip.
*     security:
*       - bearerAuth: []
*     responses:
*       '200':
*         description: Detailed information about the trip.
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Trip'
*       '401':
*         description: Unauthorized - User not authenticated.
*       '404':
*         description: Trip not found - No trip exists with the provided ID.
*       '500':
*         description: Internal server error occurred while fetching the trip details.
*/

router.get("/trip/:id", authMiddleWare, tripsController.getByTripId);

/**
* @swagger
* /trips/:
*   post:
*     summary: Create a new trip
*     tags: [Trips]
*     description: Creates a new trip with the provided data.
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               owner:
*                 type: string
*                 description: The ID of the user who is creating the trip.
*               userName:
*                 type: string
*                 description: The name of the user who is creating the trip.
*               imgUrl:
*                 type: string
*                 description: URL to an image associated with the trip.
*               typeTraveler:
*                 type: string
*                 description: Type of traveler (e.g., solo, family, couple).
*               country:
*                 type: string
*                 description: Country where the trip takes place.
*               typeTrip:
*                 type: string
*                 description: Type of trip (e.g., adventure, relaxation).
*               numOfDays:
*                 type: number
*                 description: Number of days of the trip.
*               tripDescription:
*                 type: array
*                 items:
*                   type: string
*                 description: A list of descriptions for the trip.
*               tripPhotos:
*                 type: array
*                 items:
*                   type: string
*                 description: A list of URLs to photos of the trip.
*             required:
*               - owner
*               - userName
*               - country
*               - typeTrip
*               - numOfDays
*               - tripDescription
*     responses:
*       '200':
*         description: Trip successfully created.
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Trip'
*       '401':
*         description: Unauthorized - User not authenticated.
*       '400':
*         description: Bad Request - Incorrect or missing data.
*       '500':
*         description: Internal server error occurred while creating the trip.
*/

router.post("/", authMiddleWare, tripsController.post);

/**
* @swagger
* /trips/{id}:
*   put:
*     summary: Update a trip by ID
*     tags: [Trips]
*     description: Updates the details of an existing trip with the given ID.
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*         description: The unique identifier of the trip to be updated.
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/TripUpdateRequest'
*     responses:
*       '200':
*         description: Trip successfully updated.
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Trip'
*       '401':
*         description: Unauthorized - User not authenticated.
*       '404':
*         description: Not Found - No trip found with the provided ID.
*       '400':
*         description: Bad Request - Incorrect or missing data in the request body.
*       '500':
*         description: Internal server error occurred while updating the trip.
*/

router.put("/:id", authMiddleWare, tripsController.putById);

/**
* @swagger
* /trips/{id}:
*   delete:
*     summary: Delete a trip by ID
*     tags: [Trips]
*     description: Deletes a specific trip based on the trip's ID.
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*         description: The unique identifier of the trip to be deleted.
*     responses:
*       '200':
*         description: Trip successfully deleted.
*       '401':
*         description: Unauthorized - User not authenticated.
*       '404':
*         description: Not Found - No trip found with the provided ID.
*       '500':
*         description: Internal server error occurred while deleting the trip.
*/

router.delete("/:id", authMiddleWare, tripsController.deleteById.bind(tripsController));




// Add comment
/**
* @swagger
* /trips/comments/{tripId}:
*   post:
*     summary: Add a comment to a trip
*     tags: [Comments]
*     description: Adds a new comment to the specified trip by its ID.
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: tripId
*         required: true
*         schema:
*           type: string
*         description: The unique identifier of the trip to which the comment is being added.
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/CommentRequest'
*     responses:
*       '200':
*         description: Comment successfully added to the trip.
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Comment'
*       '401':
*         description: Unauthorized - User not authenticated.
*       '404':
*         description: Not Found - No trip found with the provided ID.
*       '400':
*         description: Bad Request - Incorrect or missing data in the request body.
*       '500':
*         description: Internal server error occurred while adding the comment.
*/



router.post("/comments/:tripId", authMiddleWare, tripsController.addComment.bind(tripsController));

/**
* @swagger
* /trips/comments/{tripId}/{commentId}:
*   delete:
*     summary: Delete a comment from a trip
*     tags: [Comments]
*     description: Deletes a specific comment from the specified trip, based on the comment's ID.
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: tripId
*         required: true
*         schema:
*           type: string
*         description: The unique identifier of the trip from which the comment is being deleted.
*       - in: path
*         name: commentId
*         required: true
*         schema:
*           type: string
*         description: The unique identifier of the comment to delete.
*     responses:
*       '200':
*         description: Comment successfully deleted.
*       '401':
*         description: Unauthorized - User not authenticated.
*       '404':
*         description: Not Found - Either the trip or the comment does not exist with the provided IDs.
*       '403':
*         description: Forbidden - User does not have permission to delete the comment.
*       '500':
*         description: Internal server error occurred while deleting the comment.
*/

router.delete("/comments/:tripId/:commentId", authMiddleWare, tripsController.deleteComment.bind(tripsController));



// Add like
/**
* @swagger
* /trips/likes/{tripId}:
*   post:
*     summary: Add a like to a trip
*     tags: [Likes]
*     description: Adds a like to the specified trip by its ID. If the trip is already liked by the user, the like is not duplicated.
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: tripId
*         required: true
*         schema:
*           type: string
*         description: The unique identifier of the trip to which the like is being added.
*     responses:
*       '200':
*         description: Like successfully added to the trip.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: Like added successfully.
*       '401':
*         description: Unauthorized - User not authenticated.
*       '404':
*         description: Not Found - No trip found with the provided ID.
*       '403':
*         description: Forbidden - User has already liked the trip.
*       '500':
*         description: Internal server error occurred while adding the like.
*/

router.post("/likes/:tripId", authMiddleWare, tripsController.addLike.bind(tripsController));

export default router;
