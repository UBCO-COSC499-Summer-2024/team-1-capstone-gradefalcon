# Personal Log
Ahmad Saleem Mirza


## Wednesday (June 7 - 12)

### Timesheet
Clockify report
![alt text](../Clockify/Ahmad/June7-12.jpg)

### Current Tasks (Provide sufficient detail)
  * #1: Dockerize database
  * #2: OMR Research
  * #3: Organizing the repo

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
        <td>Dockerize database
        </td>
        <!-- Status -->
        <td>Complete
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>OMR Research
        </td>
        <!-- Status -->
        <td>In Progress
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Organizing the repo
        </td>
        <!-- Status -->
        <td>In Progress
        </td>
    </tr>
    
</table>

### Cycle Goal Review (Reflection: what went well, what was done, what didn't; Retrospective: how is the process going and why?)
Dockerizing the database took a while, primarily because the docker-compose format was new to me, and I kept running into niche issues (having to specify the localhost address 127.0.0.1 and converting docker run commands to docker-compose arguments). I've managed to resolve these issues and now need to add them to our pre-made awesome-compose container to migrate the database from maria-db to postgres. 

I've familiarized myself with the YOLO library from *Ultralytics* which we will use for scanning the sheet itself. The tough part here is first finding out what to annotate and manually doing it over a training set of hundreds of sheets and then exporting what YOLO detecting to some format that we can use for marking.

Moreover, as per the new guidelines from Dr. Fazackerley about how our weekly, team reports and repository branches should be structured, we have to some cleaning up to do.  
### Next Cycle Goals (What are you going to accomplish during the next cycle)
  * Continue OMR development
  * Reorganize repo
  * Class creation

## Friday (June 5 - 7)

### Timesheet
Clockify report
![June5-7 report](../Clockify/Ahmad/June5-7.jpg)

### Current Tasks (Provide sufficient detail)
  * #1: UI Design Feedback
  * #2: Create database via online service provider
  * #3: Editing design video

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
        <td>UI Design Feedback
        </td>
        <!-- Status -->
        <td>Complete
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Database creation
        </td>
        <!-- Status -->
        <td>Complete
        </td>
    </tr>
    <tr>
        <!-- Task/Issue # -->
        <td>Design video editing
        </td>
        <!-- Status -->
        <td>In Progress
        </td>
    </tr>
</table>

### Cycle Goal Review (Reflection: what went well, what was done, what didn't; Retrospective: how is the process going and why?)
I created the database using an online service provider, but after recent feedback from Dr. Fazackerley, the database must be stored in a Docker container, so that needs amendment. Editing the design video should be fairly straightforward and not take that much time.

### Next Cycle Goals (What are you going to accomplish during the next cycle)
  * Finish design video
  * Dockerize database
  * Start OMR implementation

## May 31 - Jun 05, 2024

### Tasks Worked On
- **Design Document:**
  - Implemented MVC for system design architecture
  - Finalized database design to model all system entities and attributes
  - Developed use case models to demonstrate high level usage scenarios
  - Feedback on user interface design

### Progress Summary
- **Completed:**
  - Database schema
  - Use case models
  - System architecture
  - Design document
- **In Progress:**
  - Development environment setup
  - UI design implementation

### Goals
- **This Cycle's Goals:**
  - Finish system architecture, database schema and use case models
  - Evaluate proposed UI design
  - Finalize design document
- **Next Cycle Plan (2 Days):**
  - Setup database server in postgres
  - Implement frontend with working navigation
  - Design presentation video

## May 27 - 31, 2024

### Tasks Worked On
- **Project Plan:**
  - Drafted the Project Proposal
  - Collaborated on success criteria
  - Developed feature list
  - Came up with constraints and assumptions
  - Edited video for project plan presentation
- **Backlog Management:**
  - Organized and assigned tasks via kanban dashboard
- **Design Document:**
  - Started work on system design architecture to be implemented

### Progress Summary
- **Completed:**
  - Project Plan
  - Project Plan Presentation Video
- **In Progress:**
  - Database schema
  - System architecture
  - Data flow diagram

### Goals
- **This Week's Goals:**
  - Develop feature list and success criteria
  - Finish project plan
  - Reformat project plan into markdown
  - Finish video
- **Next Cycle Plan (5 Days):**
  - Set up the CI/CD pipeline
  - Develop data flow diagrams (DFD)
  - Develop database schema
  - Finalize design document