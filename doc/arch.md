The plan is to develop an instructor facing client as well as a student facing client. The instructor client will allow the instructors to create a new class, create/manage office hour intervals & generate links for invitations. The student client will allow the students to choose meeting slots, manage their meeting slots and provide additional information to the instructor about the meeting. Additionally, both clients will allow the users to export/sync the meeting to their personal calendars.

Instructor only endpoints will include: 
- creating/manage a new class
- submitting a class list
- creating/manage office hour intervals
- generate links. 

Student only endpoints will include:
- choose meeting slots
- providing addition information

Endpoints for both clients:
- manage their account preferences
- export/sync to personal calendar

For the front end, we will be making a React Javascript client (styled with Bootstrap).For the back end, we will use a Node.js Express server on a MongoDB database. The application will be hosted on Heroku. To implement the sync/export functionality, we are also considering using the Google calendars API.
