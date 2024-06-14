# Personal Log
## Friday (6/12- 6/14)

### Timesheet
Clockify report
![time](https://github.com/UBCO-COSC499-Summer-2024/team-1-capstone-gradefalcon/blob/eb0f920469f1a0df5389c184043ef61251d22275/docs/weekly_logs/Clockify/Omar/Time3.png)

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
   - Installed necessary packages: pg, bcrypt, jsonwebtoken, and body-parser.
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
  - Developed and tested the login feature, including navigation to the dashboard.
  - Set up and verified the connection between Express and PostgreSQL.

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
