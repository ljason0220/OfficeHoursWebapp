We plan on following the OpenAPI specification https://swagger.io/docs/specification/about/

We identified that we need three tables: meeting, person, course. Both students and instructors are part of the person table. We determined that those three tables are enough to cover all the information necessary. There will be an in_instructor flag to identify persons that are instructors. We decided that not separating students and instructors into their separate tables since they have a lot of overlap. Each person will have a list of courses and meetings. We feel that this would make querying for meetings for a given user easier. The instructor will have a list of availabilities that will be used to determine how long the meeting intervals are and when they will happen.

Currently Planned Endpoints:
- User login: <domain>/user/login
- Manage Preference: <domain>/user/preferences
- Manage Office hours: <domain>/user/course/office_hours
  - Create interval: <domain>/user/course/office_hours/create
    - Only available to Instructors
  - Booking/managing a meeting slot: <domain>/user/course/office_hours/meetings
- Upload classlist: <domain>/user/course/create_class
  - Only available to Instructors

Our swagger specifications is at https://github.com/csc302-fall-2018/proj_WeLuvOfficeHours/blob/master/Kangdaewoo_WeLuvOfficeHours_1.0.0_swagger.yaml

