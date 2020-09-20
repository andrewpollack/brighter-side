# DB Choice
Because each table's field schemas are bound to change as development continues, I'm going to go with a NoSQL DB. Main decision is between Cassandra and MongoDB.

# Tables
Current entities within the app will be `Users` and `Moments`. A typical flow is that a `User` will save a `Moment`, and that `Moment` will be displayed at a later point.

## Users
| Field  |  Data Type  |
|----------|--------|
| user_id  | Object_Id   |
| username | String |
| password | String |
| email | String |
| firstname | String |
| moments | Lost of Moment Object_ID |

## Moments
| Field  |  Data Type  |
|----------|--------|
| moment_id  | Object_Id   |
| user_owner_id | User Object_Id |
| text_description | String |
| date | DateTime |
