# proj_WeLuvOfficeHours

Things to include: 
Short report (4-8 min’ read)
What did you actually build during this phase?
How is this different from what you originally proposed? Why?
High-level design of your software.
Technical highlights: interesting bugs, challenges, lessons learned, observations, etc.
Reflect on your teamwork and process. What worked well, what  needs improvement.
Ideally you will have specific artifacts from your development process to show (for instance, a burndown chart)
Triage: What will you build for phase 3, the final demo?

### MVP
The MVP is a web application that allows a user to view the office hours offered by their professors and TAs for the current week/day. After viewing what's available to them, they should be able to book an office hours slot for a given amount of time that they feel is required. After the booking, they should be able to confirm that they have booked that slot and, if need be, export the booking(s) to their personal calendars. A professor should be able to invite their students (and only their students) to office hours to discuss course material. Additionally, the professors need to be able to set their office hours from a week to week basis and make any adjustments if something comes up. If their office hours are around the same time each week, they should be able to set it as such so they don't need to go through the hassle of updating them each week. Moreover, professors should know who they are going to meet with and about what (so they can be prepared and help the student as best as possible). Finally, just like their students, professors should be able to export their booked meetings to their personal calendars.

### List of dependencies (and what for)
- http-server
- live-server
- mongoose
- express
- debug
- body-parser

* chai
* chai-http
* mocha
* nodemon

### Other stuff...

APIs:
https://app.swaggerhub.com/apis/Kangdaewoo/WeLuvOfficeHours/3.0.0#/
