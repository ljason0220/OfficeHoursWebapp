In terms of testing the application, we plan on testing the client and server sides independently. Meaning, we will be running unit tests on the front end Javascript and on the API calls in the backend, these will be done by the members of the team working in that specific side. The current plan for the front end is to develop a React application, and so testing the client side will be done using the [Jest](https://jestjs.io/en/) framework which is what is recommended to use. The server will be run on Node.js with the Express framework, however none of us have done API testing before, so it's still undecided what framework will be used to run these tests (there have been considerations for tools such as Postman and SOAPUI though). Additionally, there will be continuous integration for the tests through Travis, which will be set up by Gordon. The process for testing won't be TDD, in that code won't be developed based on tests developed. Initially, the plan isn't to do end to end testing where scenarios are being tested, however it will be considered if there is time.

Example of how our testing will be conducted:

      For logging in, the user would type in their username and password in a form and click a button.
      The client would (HTTP POST with userid and password) and the server would
      hash the password and query the database with the userid and compare with the stored password hash.
      The front end team would write tests to check that the form passes the correct data into 
      the HTTP request, check that forms sanitizes the input properly, check that the server response will 
      trigger the correct event.
      The backend team would write tests to ensure that the querying function works properly, check that the
      correct information is put in the response.
      Either the frontend team or backend team would use (curl/soap.ui) to check the endpoints
      work properly.
