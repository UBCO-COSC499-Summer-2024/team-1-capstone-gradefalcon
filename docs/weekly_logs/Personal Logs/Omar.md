# Personal Log
## Friday (6/18- 6/20)

### Timesheet
Clockify report
![time](https://github.com/UBCO-COSC499-Summer-2024/team-1-capstone-gradefalcon/blob/46cd156b504ade8651f001d8884c2115dbcff91c/docs/weekly_logs/Clockify/Omar/Time5.png)

### Current Tasks (Provide sufficient detail)

1. **Implement Class Creation Functionality**
   - Made some final changes to this feature: Verify on the backend if the class and student exist in the database. If not, create them and update the relevant tables, particularly the enrollment table, as per the ER diagram. The enrollment table uses unique instructor_id and course_id to allow instructors to have multiple courses with the same name. If the class exists, use the existing class_id.
   - I most notably added a feature to notify the user on the front-end if the class already exists. Display a toast message confirming the class creation and then navigate the user to the class-management tab.

2. **Integrate Auth0 for Authentication and Authorization**

    1. **Install Auth0 SDK**:
      - Installed Auth0 React SDK using `npm install @auth0/auth0-react`.

    2. **Configure Auth0Provider in `App.js`**:
      - Wrapped the application with `Auth0Provider` to enable Auth0 across the app.
      - Configured the Auth0 provider with the domain and client ID.

    3. **Update `ProtectedRoute` Component**:
      - Modified the `ProtectedRoute` component to use Auth0's authentication status.
      - Ensured only authenticated users can access protected routes.

    4. **Update `Login` Component**:
      - Replaced manual login handling with Auth0's `loginWithRedirect` method.
      - Simplified the login process by leveraging Auth0's authentication.

    5. **Add `LogoutButton` Component**:
      - Created a `LogoutButton` component using Auth0's `logout` method.
      - Configured the button to redirect users to the Auth0 logout endpoint and then back to the application.

    6. **Add `Profile` Component**:
      - Created a `Profile` component to display user information such as name and profile picture using Auth0.
      - Used the `useAuth0` hook to fetch and display user profile details.

    7. **Update `NavBar` Component**:
      - Integrated `Profile` and `LogoutButton` components into the `NavBar`.
      - Ensured the `NavBar` displays user information and includes a logout option.

    8. **Configure Auth0 Application Settings**:
      - Set the following URLs in the Auth0 application settings:
        - **Allowed Callback URLs**: `http://localhost:3000`
        - **Allowed Logout URLs**: `http://localhost:3000`
        - **Allowed Web Origins**: `http://localhost:3000`
      - Prepared similar configurations for the production environment with the appropriate domain.
      
  3. **Refactored File Structure and code for Maintainability on both the Frontend and Backend**

  3. **Started work on Computer Vision model**

### Progress Update (since 18/6/2024)
<table>
    <tr>
        <td><strong>TASK/ISSUE #</strong>
        </td>
        <td><strong>STATUS</strong>
        </td>
    </tr>
    <tr>
        <td>#82 - Implement Class Creation Functionality
        </td>
        <td>Complete
        </td>
    </tr>
    <tr>
        <td>#54 - User Story: Import Class as a CSV file
        </td>
        <td>Complete
        </td>
    </tr>
    <tr>
        <td>#21 - User Story: Create and Manage Classes
        </td>
        <td>Complete
        </td>
    </tr>
    <tr>
        <td>#97 - Refactor Backend Structure for Improved Maintainability
        </td>
        <td>In Progress
        </td>
    </tr>
        <tr>
        <td>#98 - Refactor Frontend Structure for Improved Maintainability
        </td>
        <td>In Progress
        </td>
    </tr>
        <tr>
        <td>#61 - Create User Roles and Permissions, Auth0
        </td>
        <td>In Progress
        </td>
    </tr>
        </tr>
        <tr>
        <td>#10 - User Story: Develop Computer Vision Model
         </td>
        <td>In Progress
        </td>
    </tr>

</table>

### Cycle Goal Review (Reflection: what went well, what was done, what didn't; Retrospective: how is the process going and why?)
- **What Went Well:**
  - Refactored code successfully
  - Got a draft for the Auth0 running

- **What Was Done:**
  -  added a feature to notify the user on the front-end if the class already exists. Display a toast message confirming the class creation and then navigate the user to the class-management tab.
  - Refactored login and sign up with Auth0
  - Refactor Backend and Frontend

- **What Didn't Go Well:**
  - Before trying Auth0 I tried a different 3rd party service authentication Logto but had dependencies issues half way through my setup so I had to ditch it and essently lost about 5h of work. 
  - Refactoring the code in include Auth0 is proving to be a daunting task and I don't know if it's worth it
  - Had to do a bunch of code review on big PRs.

- **Retrospective:**
  - Got a draft running for Auth0.
  - Reorganized file structure.
  - Got started on Computer Vision model.


### Next Cycle Goals (What are you going to accomplish during the next cycle)

1. **OMR:**
   - Work on implementing features for exam creation and Optical Mark Recognition (OMR).

2. **Role-Based Authentication:**
   - Implement role-based authentication to manage different user types.

4. **Documentation and Backend Testing:**
   - Document the new features and improvements.
   - Write unit tests for the new functionalities to ensure reliability.

5. **Possibly revisit UI:**

## Wednesday (6/14- 6/18)

### Timesheet
Clockify report
![time](https://github.com/UBCO-COSC499-Summer-2024/team-1-capstone-gradefalcon/blob/46cd156b504ade8651f001d8884c2115dbcff91c/docs/weekly_logs/Clockify/Omar/Time5.png)

### Current Tasks (Provide sufficient detail)

1. **Implement Class Creation Functionality**
   - Add functionality to create classes, including adding the Instructor ID and Class ID to the database.

2. **User Story: Import Class as a CSV file**
   - Develop the functionality to import classes with student data from CSV files.
   - Ensure that each class is associated with an instructor and has a unique combination of instructor ID and course ID.
   - Validate student data before inserting it into the database.

3. **User Story: Create and Manage Classes**
   - Enable class creation and management, ensuring proper association with instructors.
   - Implement features to manage class details and enrollments.


### Progress Update (since 14/6/2024)
<table>
    <tr>
        <td><strong>TASK/ISSUE #</strong>
        </td>
        <td><strong>STATUS</strong>
        </td>
    </tr>
    <tr>
        <td>#82 - Implement Class Creation Functionality
        </td>
        <td>In Progress
        </td>
    </tr>
    <tr>
        <td>#54 - User Story: Import Class as a CSV file
        </td>
        <td>In Progress
        </td>
    </tr>
    <tr>
        <td>#21 - User Story: Create and Manage Classes
        </td>
        <td>In Progress
        </td>
    </tr>
    <tr>
        <td>Student Data Validation
        </td>
        <td>Complete
        </td>
    </tr>
    <tr>
        <td>Implement Route Protection
        </td>
        <td>Complete
        </td>
    </tr>
</table>

### Cycle Goal Review (Reflection: what went well, what was done, what didn't; Retrospective: how is the process going and why?)
- **What Went Well:**
  - Successfully implemented create new class feature.
  - Improved validation for student data during import.

- **What Was Done:**
  - Developed server-side logic to handle class and student data import.
  - Enhanced client-side code to fetch session info and validate student data before sending it to the server.

- **What Didn't Go Well:**
  - Initial issues with session cookie storage were resolved by adjusting session middleware settings.
  - Debugging and parsing the csv file properly took longer than expected,  sending the file over to the backend as well was a hassle.

- **Retrospective:**
  - Some good progress was done in regard to the create class feature.
  - Need to assign tasks to team members stragically.
  - need to reevaluate some UI design choices and some of the code logic in our server.js file to take into account, RBAC, authentication, route protection and encryption.


### Next Cycle Goals (What are you going to accomplish during the next cycle)
1. **Exam Creation and OMR:**
   - Work on implementing features for exam creation and Optical Mark Recognition (OMR).

2. **Role-Based Authentication:**
   - Implement role-based authentication to manage different user types.

3. **Server.js Adjustments:**
   - Adjust the server.js code to handle all user types effectively.

4. **Documentation and Backend Testing:**
   - Document the new features and improvements.
   - Write unit tests for the new functionalities to ensure reliability.

5. **CSV Import Feature Refinement:**
   - Enhance the CSV import feature to handle edge cases and improve error handling.
   - Implement feedback messages for successful and failed imports.


## Friday (6/12- 6/14)

### Timesheet
Clockify report
![time](https://github.com/UBCO-COSC499-Summer-2024/team-1-capstone-gradefalcon/blob/30dc1b2adfda3ae85638a99d5db0fcf800614b26/docs/weekly_logs/Clockify/Omar/Time4.png)

### Current Tasks (Provide sufficient detail)
1. **Session Management Implementation**
   - Implemented session management to replace JWT authentication.
   - Stored session information in cookies.
   - User ID now stored in cookies for session tracking.

2. **Login Feature Development**
   - Created a mock login page.
   - Set up navigation to the dashboard page post-login.
   - Added route protection to authenticate access to certain pages.

3. **Database Integration**
   - Set up Express application with PostgreSQL integration.
   - Ensured the database connection works using Express.js.
   - Installed necessary packages: pg, jsonwebtoken, and body-parser.
   - Removed bcrypt after initial setup.

### Progress Update (since 6/5/2024)
<table>
    <tr>
        <td><strong>TASK/ISSUE #</strong>
        </td>
        <td><strong>STATUS</strong>
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>#12 Setup Express Application with PostgreSQL Integration
        </td>
        <td>Complete
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>#55 Implement Session Management and Creation
        </td>
        <td>Complete
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>#62 Instructor Login and Authentication
        </td>
        <td>Complete
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Implement Route Protection
        </td>
        <td>Complete
        </td>
    </tr>
</table>

### Cycle Goal Review (Reflection: what went well, what was done, what didn't; Retrospective: how is the process going and why?)
- **What Went Well:**
  - Successfully replaced JWT authentication with session management.
  - Login feature development was completed, adding essential navigation functionalities.
  - Route protection was successfully implemented.

- **What Was Done:**
  - Implemented session management and stored session data in cookies.
  - Developed and tested the login feature, including navigation to the dashboard with authentication.
  - Set up and verified the connection between Express and PostgreSQL.
  - Fixed backend root issue in the backend connection.
  - Set up sessions in the database.

- **What Didn't Go Well:**
  - There was a lot of debugging involved in adjusting the ports, fixing the backend connection to the database, and configuring the Docker Compose, Dockerfile, and server.js file.
  - Encountered significant issues with configuration and integration, which took a considerable amount of time to resolve.

- **Retrospective:**
  - The process of integrating session management was challenging, with many obstacles to overcome.
  - The overall workflow is progressing, although it has required considerable effort and debugging to ensure tasks are completed.

### Next Cycle Goals (What are you going to accomplish during the next cycle)
1. **Exam Creation and OMR:**
   - Work on implementing features for exam creation and Optical Mark Recognition (OMR).

2. **Role-Based Authentication:**
   - Implement role-based authentication to manage different user types.

3. **Server.js Adjustments:**
   - Adjust the server.js code to handle all user types effectively.

4. **CSV Import Feature:**
   - Implement the import CSV feature to facilitate data import.

5. **Documentation and Testing:**
   - Document the new features and improvements.
   - Write unit tests for the new functionalities to ensure reliability.

   
## Friday (6/5- 6/7)

### Timesheet
Clockify report
![time](https://github.com/UBCO-COSC499-Summer-2024/team-1-capstone-gradefalcon/blob/eb0f920469f1a0df5389c184043ef61251d22275/docs/weekly_logs/Clockify/Omar/Time3.png)

### Current Tasks (Provide sufficient detail)
  * #1: Database Setup
  * #2: Configure the Backend to include our Postgres DB
  * #3: Set Up Routing

### Progress Update (since 6/5/2024) 
<table>
    <tr>
        <td><strong>TASK/ISSUE #</strong>
        </td>
        <td><strong>STATUS</strong>
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>#29: Database Setup
        </td>
        <!-- Status -->
        <td>Complete
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>#49: Configure the Backend to include our Postgres DB
        </td>
        <!-- Status -->
        <td>In Progress
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>#48: Set Up Routing
        </td>
        <!-- Status -->
        <td>In Progress
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>#10: Develop Computer Vision Model
        </td>
        <!-- Status -->
        <td>In Progress
        </td>
    </tr>
</table>

### Cycle Goal Review (Reflection: what went well, what was done, what didn't; Retrospective: how is the process going and why?)
I completed the Database Setup as planned, but configuring the backend to include our Postgres DB and I am setting up routing is taking longer than expected due to the time I had to spend to integrate the db into the backend, I also ran into some bugs with my github desktop app.

### Next Cycle Goals (What are you going to accomplish during the next cycle)
  * Integrate more pages into our app
  * Have 2-3 features working properly
  * Work on the presentation due on Friday
  * Optimize the UI if time permits

---


## Applicable Date Range
- Week of 27/05/2024

## Tasks Worked On
- **UI and UX Design:**
  - Completed the dashboard page.
  - Began working on remaining pages for the UI/UX design.
- **Project Plan:**
  - Drafted the Project Proposal.
  - Defined the MVP (Minimum Viable Product).
  - Created user stories.
- **Backlog Management:**
  - Started organizing the backlog and populating it.

## Features and Associated Tasks
- **Dashboard Page:**
  - Completed design (UI/UX).
  - Associated tasks: Dashboard layout design.
- **UI/UX Design:**
  - Remaining pages in progress.
  - Associated tasks: Page layout designs, user interface adjustments.
- **Project Planning:**
  - Drafted Project Proposal, MVP, user stories.
  - Associated tasks: Proposal drafting, user story creation.
- **Backlog Management:**
  - Organizing and populating the backlog.
  - Associated tasks: Backlog categorization, task prioritization.

## Progress Summary
- **Completed:**
  - Dashboard page design (Large).
  - Project Proposal draft (Medium).
  - MVP definition (Medium).
  - User stories creation (Medium).
- **In Progress:**
  - Remaining UI/UX pages (Large).

## Goals Recap
- **This Week's Goals:**
  - Complete the dashboard page design.
  - Draft the Project Proposal, MVP, and user stories.
  - Organize and populate the backlog.
- **Next Cycle Plan (3-4 Days):**
  - Finish remaining pages for the UI/UX design.
  - Start contributing to the system design document.
  - Set up the CI/CD pipeline.

# Personal Log

## Applicable Date Range
- Week of 31/05/2024 to 05/06/2024

## Tasks Worked On
- **UI and UX Design:**
  - Finished the Figma UI design.
  - Spent significant time refining and optimizing the UI.
- **System Architecture:**
  - Worked extensively on system architecture.
  - Read up on possible solutions.
  - Created diagrams using MVC and RBAC.
  - Described the architecture choices.
- **Use Case Design:**
  - Created use case diagrams.
  - Developed use case scenarios and journey lines.
- **Database Design:**
  - Consulted on database design.
- **Automation:**
  - Created a Python script to automate dashboard creation.
- **Kanban Board Management:**
  - Populated the Kanban Board with user stories and tasks.
  - Added Milestones and labeled everything.
  - Linked with project issues and added tasks to be activated in the future.
- **Meetings:**
  - Attended team meeting.
  - Met with Professor Lawrence.

## Features and Associated Tasks
- **UI Refinements:**
  - Associated tasks: Dashboard layout design, UI refinements, and optimizations.
- **System Architecture:**
  - Created and described system architecture diagrams.
  - Associated tasks: Diagram creation, architecture description, research on possible solutions.
- **Use Case Design:**
  - Developed use case diagrams and scenarios.
  - Associated tasks: Use case diagram creation, scenario and journey line development.
- **Database Design:**
  - Provided consultation.
  - Associated tasks: Database schema discussion.
- **Automation:**
  - Developed Python script for dashboard automation.
  - Associated tasks: Script writing and testing.
- **Kanban Board Management:**
  - Populated with user stories and tasks.
  - Added Milestones and labels, linked with project issues.
  - Associated tasks: Kanban Board organization, task linking.
- **Meetings:**
  - Team meeting.
  - Meeting with Professor Lawrence.

## Progress Summary
- **Completed:**
  - Figma UI design (Large).
  - System architecture diagrams and description (Large).
  - Use case diagrams and scenarios (Large).
  - Python script for dashboard automation (Medium).
  - Kanban Board population and management (Small/Medium).
- **In Progress:**
  - Remaining UI/UX pages (Small).

## Goals Recap
- **This Week's Goals:**
  - Refine and optimize the UI.
  - Complete Figma UI design.
  - Work on system architecture and create related diagrams.
  - Develop use case diagrams and scenarios.
  - Consult on database design.
  - Create a Python script for dashboard automation.
  - Populate and manage the Kanban Board.
  - Attend team meetings and meet with Professor Lawrence.
- **Next Cycle Plan (3-4 Days):**
  - Work on the video for system architecture.
  - Set up Docker.
  - Start looking into the OCM.
  

## Applicable Date Range
- Week of 05/06/2024 to 07/06/2024

## Tasks Worked On
- **UI and UX Design:**
  - Finalized the UI mockups.
  - Added the input exam and answer key pages.
  - Linked the new pages to the existing design.
- **Slide Deck:**
  - Worked on the slide deck for the system design video.
  - Refined and optimized the look of the slide deck.
- **User Flow Diagram:**
  - Worked on creating the user flow diagram.
- **Docker Setup:**
  - Set up Docker.
  - Got the awesome compose file up and running.

## Progress Summary
- **Completed:**
  - Finalized UI mockups (Medium).
  - Added input exam and answer key pages (Small).
  - Slide deck for system design video (Small).
  - User flow diagram (Medium).
  - Docker setup and compose file (Medium).

## Goals Recap
- **This Week's Goals:**
  - Finalize UI mockups.
  - Add input exam and answer key pages.
  - Work on the slide deck for the system design video.
  - Create the user flow diagram.
  - Set up Docker and compose file.
- **Next Cycle Plan (3-4 Days):**
  - Start CI/CD set up
  - Review the front end design developed by my teammmates.
  - Continue refining Docker setup.
  - Start looking into the OCM.
