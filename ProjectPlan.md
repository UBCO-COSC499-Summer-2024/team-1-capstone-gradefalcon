# Project Proposal for Project Number 2

**Team Number:** 1

**Team Members:**

- Omar Ankit
- Ahmad Saleem Mirza
- Nelson Nguru Ngumo
- Jusnoor Kaur Sachdeva
- Bennett Witt

## Overview:

## Project Purpose or Justification (UVP)

**What is the purpose of this software? What problem does it solve? What is the unique value proposition? Why is your solution better than others?**

The Optical Marking Management System aims to streamline the process of creating, marking, analyzing, and returning optically marked exams. The Department of Computer Science, Mathematics, Physics, and Statistics at UBCO currently utilizes a single outdated physical optical marking machine with a very low allowance for user error and a high bottleneck during exam season. Other errors include:

- The marked exams cannot be returned to the students to see their wrong answers
- Long processing times
- Incorrectly scanning one sheet requires the whole stack of papers to be rescanned
- And many more.

Our solution, titled GradeFalcon, is a web application that will provide a user-friendly interface for instructors to manage exams efficiently, offer statistical analysis and visualization tools to improve performance insights, and ensure a secure platform for both instructors and students to view exam data. Our solution stands out by integrating features from the standard UBC optical marking paper and tools like ZipGrade, accommodating custom bubble sheets, and detecting errors in scanned sheets. The unique value proposition is its adaptability, efficiency, and compliance with privacy regulations. Additionally, the computer vision model will be decoupled from the main system, ensuring flexibility and maintainability.

## High-Level Project Description and Boundaries

**Our Minimum Viable Product (MVP) will include the following features:**
- Instructor login and authentication.
- Creation and management of classes and exams.
- Upload and parsing of scanned bubble sheets.
- Detection of wrongly scanned sheets and duplicate or non-present student IDs.
- Automated marking and review of exams.
- Statistical analysis and visualization of exam performance.
- Secure student access to view their exam results.
- Administrative functionalities for system maintenance.
- Separate computer vision model using YOLO for detecting custom bubble sheet formats.
- A reporting system for contesting marking errors.
- Flexible options for generating answer keys, allowing either manual entry on the website or uploading a filled-out bubble sheet.
- Support for a variable number of options per question.

**The system boundaries include:**
- Developing the web application and its backend infrastructure.
- Ensuring secure data handling.
- Providing necessary documentation.

**The system boundaries do not include:**
- Physical infrastructure.
- Hardware procurement.
- Integration with external non-standard systems.

## Measurable Project Objectives and Success Criteria

**Objective:** Develop a responsive web application for managing optically marked exams.

**Success Criteria:**
1. **Instructors can create and manage exams efficiently:**
   - Instructors will be able to create and manage exams through an intuitive interface with 90% positive feedback, measured by the number of complaints per exam.
   - Flexible options for generating answer keys, allowing either manual entry on the website or uploading a filled-out bubble sheet.

2. **The system supports the upload, parsing, and marking of bubble sheets within 30 minutes:**
   - The entire process from upload to marking completion should take no longer than 30 minutes for a batch of 100 sheets.

3. **Statistical analysis and visualization tools are functional and accurate:**
   - Tools will generate statistical analyses and visualizations with 95% accuracy.
   - Implement statistical tools to analyze exam results, including mean scores, standard deviations, distribution graphs, and other relevant metrics.
   - Provide year-over-year performance tracking to help instructors evaluate trends.
   - Enable comparisons between different classes or exam periods to identify performance benchmarks.

4. **Students can efficiently view their exam results:**
   - Students will log in and view their results, see right and wrong answers, and report misgrading efficiently, measured by the number of complaints per exam.

5. **Compliance with privacy regulations is maintained:**
   - The system will undergo regular audits to ensure zero compliance issues.

6. **The system detects and flags wrongly scanned sheets and duplicate or non-present student IDs:**
   - Achieve 95% accuracy in detecting and flagging errors.

7. **The computer vision model accurately detects and interprets custom bubble sheet formats:**
   - The model will achieve 90% accuracy in detection and interpretation of custom formats.

8. **Automatically grade the exams and store the results in the database:**
   - Develop an algorithm to compare the detected answers with the answer key.
   - Automatically grade the exams and store the results in the database.

**Overall System Goal:**
- The entire system will be fully functional by August 9, 2024.


## Users, Usage Scenarios and High Level Requirements

### Users Groups:

Provide a a description of the primary users in the system and when their high-level goals are with the system (Hint: there is more than one group for most projects). Proto-personas will help to identify user groups and their wants/needs.

**Instructors**

Goals:

- Create and manage classes and exams.
- Upload scanned bubble sheets and review marked exams.
- Run statistical analyses and visualize exam performance.
- Download exam results and manage student data.
- Enter the correct answers manually or by uploading a filled-out bubble sheet

Needs:

- Intuitive interface for managing exams.
- Accurate and efficient marking system.
- Detailed statistical reports and visualizations.
- Flexible options for generating answer keys
- Support for a variable number of options per question

**Students**

Goals:

- View their exam results, including right and wrong answers.
- Report any misgrading efficiently.

Needs:

- Simple and user-friendly interface for viewing results.
- Ability to understand their performance and identify mistakes.
- Mechanism to report discrepancies in grading.

**Administrators**

Goals:

- Maintain and manage the system.
- Ensure data security and compliance with privacy regulations.

Needs:

- Tools to manage user accounts and system settings.
- Robust security measures to protect user data.
- Maintenance tools to ensure system reliability and performance.

### Envisioned Usage

What can the user do with your software? If there are multiple user groups, explain it from each of their perspectives. These are what we called _user scenarios_ back in COSC 341. Use subsections if needed to make things more clear. Make sure you tell a full story about how the user will use your software. An MVP is a minimal and viable, so don’t go overboard with making things fancy (to claim you’ll put in a ton of extra features and not deliver in the end), and don’t focus solely on one part of your software so that the main purpose isn’t achievable. Scope wisely. Don't forget about journey lines to describe the user scenarios.

**Instructor Scenario**

- Login: Instructors log into the system using secure authentication.
- Exam Creation: They create a new class and exam, specifying details like the number of questions and bubble sheet format.
- Upload and Parsing: Instructors upload a scanned PDF of the bubble sheets. The system parses the sheets, marks the exams, and highlights correct and incorrect answers. It detects and flags any wrongly scanned sheets or duplicate/non-present student IDs.
- Answer Key Entry: Instructors can either enter the correct answers manually on the website or upload a filled-out bubble sheet.
- Flexible Options: The system supports a variable number of options per question.
- Analysis and Visualization: Instructors run statistical analyses to generate visual reports on student performance.
- Download Results: They download exam results for further offline analysis.

**Student Scenario**

- Login: Students log into the system using secure authentication.
- View Results: They view their exam results, including marked answers and performance statistics.
- Report Misgrading: Students can report any misgrading they find, which is then flagged for instructor review.

**Administrator Scenario:**

- Login: Administrators log into the system using secure authentication.
- System Management: They manage user accounts, system settings, and ensure data security.
- Maintenance: Administrators perform maintenance tasks to ensure system reliability and performance.

### Requirements:

In the requirements section, make sure to clearly define/describe the **functional** requirements (what the system will do), **non-functional** requirements (performane/development), **user requirements (what the users will be able to do with the system and **technical\*\* requirements. These requirements will be used to develop the detailed uses in the design and form your feature list.

#### Functional Requirements:

- Describe the characteristics of the final deliverable in ordinary non-technical language
- Should be understandable to the customers
- Functional requirements are what you want the deliverable to do

&nbsp;1. Instructor Functions:

- Create classes and exams.
- Upload and parse scanned bubble sheets.
- Mark and review exam sheets.
- Run statistics and visualize exam data.
- Enter students into the system via csv file upload
- Visual verification of answer grading
- Alter marks after submission

&nbsp;2. Student Functions:

- View exam results during the course interval.

&nbsp;3. Administrator Functions:

- Maintain and manage the system

#### Non-functional Requirements:

- Specify criteria that can be used to judge the final product or service that your project delivers
- List restrictions or constraints to be placed on the deliverable and how to build it; remember that this is intended to restrict the number of solutions that will meet a set of requirements.

- Secure login and authentication
- Efficient data entry and reporting
- The system must handle a high volume of student data efficiently.
- Ensure data security and compliance with privacy regulations.
- Responsive web design for use on both desktop and mobile devices.
- Dockerized deployment for consistency and scalability.

#### User Requirements:

- Describes what the user needs to do with the system (links to FR)
- Focus is on the user experience with the system under all scenarios

- Efficient onboarding process for instructors.
- Instructors need an intuitive interface for managing exams and running analyses.
- Students need a simple and efficient way to view their exam results and report misgrading through a reporting system for contesting marking errors.
- Administrators need tools to manage the system and ensure data security.

#### Technical Requirements:

- These emerge from the functional requirements to answer the questions:
  -- How will the problem be solved this time and will it be solved technologically and/or procedurally?
  -- Specify how the system needs to be designed and implemented to provide required functionality and fulfill required operational characteristics.

- Responsive web design for desktop and mobile.
- Secure database design supporting different exam formats.
- Dockerized deployment for consistency and scalability.
- Utilize image processing tools like OpenCV for optical recognition.
- Use a relational database to store user data, exam results, and metadata.
- Ensure the system can handle multiple types of bubble sheets and formats.
- The computer vision model should be a separate module, allowing for independent updates and maintenance.

## Tech Stack

Identify the “tech stack” you are using. This includes the technology the user is using to interact with your software (e.g., a web browser, an iPhone, any smartphone, etc.), the technology required to build the interface of your software, the technology required to handle the logic of your software (which may be part of the same framework as the technology for the interface), the technology required to handle any data storage, and the programming language(s) involved. You may also need to use an established API, in which case, say what that is. (Please don’t attempt to build your API in this course as you will need years of development experience to do it right.) You can explain your choices in a paragraph, in a list of bullet points, or a table. Just make sure you identify the full tech stack.
For each choice you make, provide a short justification based on the current trends in the industry. For example, don’t choose an outdated technology because you learned it in a course. Also, don’t choose a technology because one of the team members knows it well. You need to make choices that are good for the project and that meet the client’s needs, otherwise, you will be asked to change those choices. Consider risk analysis.

- Frontend: HTML, CSS, JavaScript (React or Angular for responsive design)
- Backend: Node.js, Python
- Database: SQL
- AI Tools: OpenCV for optical recognition
- Deployment: Docker for containerization and deployment
- Authentication: JWT for token-based authentication

## High-level risks

Describe and analyze any risks identified or associated with the project.

**Technical Risks:**

- Integration issues with existing systems: Integrating the Optical Marking system with the existing frameworks may be challenging, but this can be mitigated through thorough research into common standards and protocols, along with a detailed analysis of requirements.
- Database security vulnerabilities: Potential security vulnerabilities leading to data breaches or losses. We mitigate this by implementing multiple security measures such as database encryption etc..
- Scalability concerns: The system may not experience the same performance under a high volume of stress from increasing data. We mitigate this in the design stage by taking scalability, performance and efficiency into consideration when designing the database.
- Lack of future-proofing: The system may become obsolete in the future or may require large modifications to accommodate future advancements in technologies.

**Operational Risks:**

- Resistance to adoption by instructors: There is a risk that the system may be rejected or disliked by our primary users. This can be mitigated by building a user-friendly interface and providing comprehensive documentation to make the system easier to learn.
- Data entry errors: Data is highly important in this task so, any data entry errors could lead to high level performance errors. We mitigate this by implementing validation checks and provide clear and concise guidelines, and streamline the process where data is only handled by authorized users.

**Project Risks:**

- Delays in development: It is crucial to deliver the project on time and with the smooth running of the features desired. There might be some unforeseen circumstances that could delay development and lead to project overruns.
- Scope creep: The system may experience delays , increased costs and resource strain if the changes and the growth in the development of the project are not controlled and regulated.
- Insufficient testing: There might be some undetected bugs , system failures and user dissatisfaction post deployment if the testing is inadequate and inaccurate.
- Resource Allocation : Insufficient resource allocation such as budget and personnel could have an impact on the quality of the project.
- Compliance with Privacy Regulations : It is important to keep in mind the privacy regulations as non compliance with the same could lead to a loss of trust.

## Assumptions and constraints

What assumptions is the project team making and what are the constraints for the project?

**Assumptions:**

- Instructors have basic technical skills.
- Users will be accessing the platform from a desktop browser
- The bubble sheets to be marked will be uploaded as a PDF in high resolution

**Constraints:**

- Compliance with privacy regulations.
  UBC exam/testing policy
- Limited budget and time frame for development.
- Input format limited to PDF.
- PDFs may not always be well parsed and have meta-data issues
- A dedicated Graphics Processing Unit (GPU) will not be available

## Summary milestone schedule

Identify the major milestones in your solution and align them to the course timeline. In particular, what will you have ready to present and/or submit for the following deadlines? List the anticipated features you will have for each milestone, and we will help you scope things out in advance and along the way. Use the table below and just fill in the appropriate text to describe what you expect to submit for each deliverable. Use the placeholder text in there to guide you on the expected length of the deliverable descriptions. You may also use bullet points to clearly identify the features associated with each milestone (which means your table will be lengthier, but that’s okay). The dates are correct for the milestones.

| Milestone  | Deliverable                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| :--------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  May 29th  | Project Plan Submission                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
|  May 29th  | A short video presenation decribing the user groups and requirements for the project. This will be reviewed by your client and the team will receive feedback.                                                                                                                                                                                                                                                                                                               |
|  June 5th  | Design Submission: Same type of description here. Aim to have a design of the project and the system architecture planned out. Use cases need to be fully developed. The general user interface design needs to be implemented by this point (mock-ups). This includes having a consistent layout, color scheme, text fonts, etc., and showing how the user will interact with the system should be demonstrated. It is crucial to show the tests pass for your system here. |
|  June 5th  | A short video presenation decribing the design for the project. This will be reviewed by your client and the team will receive feedback.                                                                                                                                                                                                                                                                                                                                     |
| June 14th  | Mini-Presentations: A short description of the parts of the envisioned usage you plan to deliver for this milestone. Should not require additional explanation beyond what was already in your envisioned usage. This description should only be a few lines of text long. Aim to have 3 features working for this milestone (e.g., user log-in with credentials and permissions counts as 1 feature). Remember that features also need to be tested.                        |
|  July 5th  | MVP Mini-Presentations: A short description of the parts of the envisioned usage you plan to deliver for this milestone. Should not require additional explanation beyond what was already in your envisioned usage. This description should only be a few lines of text long. Aim to have close to 50% of the features working for this milestone. Remember that features also need to be tested. Clients will be invited to presentations.                                 |
| July 19th  | Peer testing and feedback: Aim to have an additional two features implemented and tested **per** team member. As the software gets bigger, you will need to be more careful about planning your time for code reviews, integration, and regression testing.                                                                                                                                                                                                                  |
| August 2nd | Test-O-Rama: Full scale system and user testing with everyone                                                                                                                                                                                                                                                                                                                                                                                                                |
| August 9th | Final project submission and group presentions: Details to follow                                                                                                                                                                                                                                                                                                                                                                                                            |

## Teamwork Planning and Anticipated Hurdles

Based on the teamwork icebreaker survey, talk about the different types of work involved in a software development project. Start thinking about what you are good at as a way to get to know your teammates better. At the same time, know your limits so you can identify which areas you need to learn more about. These will be different for everyone. But in the end, you all have strengths and you all have areas where you can improve. Think about what those are, and think about how you can contribute to the team project. Nobody is expected to know everything, and you will be expected to learn (just some things, not everything).
Use the table below to help line up everyone’s strengths and areas of improvement together. The table should give the reader some context and explanation about the values in your table.

For **experience** provide a description of a previous project that would be similar to the technical difficulty of this project’s proposal. None, if nothing
For **good At**, list of skills relevant to the project that you think you are good at and can contribute to the project. These could be soft skills, such as communication, planning, project management, and presentation. Consider different aspects: design, coding, testing, and documentation. It is not just about the code. You can be good at multiple things. List them all! It doesn’t mean you have to do it all. Don’t ever leave this blank! Everyone is good at something!

| Category            | Team Member 1                                     | Team Member 2                                                                   | Team Member 3                                                                                                                                         | Team Member 4                                                                           | Team Member 5                                                                                                                                     | Team Member 6                                     |
| ------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| **Experience**      |                                                   |                                                                                 |                                                                                                                                                       |                                                                                         |                                                                                                                                                   |                                                   |
| **Good At**         |                                                   |                                                                                 |                                                                                                                                                       |                                                                                         |                                                                                                                                                   |                                                   |
| **Expect to learn** | Don’t ever leave this blank! We are all learning. | Understanding your limits is important. Where do you expect you will need help? | It may not be technical skills. You may be a good coder but never worked with people in a team. Maybe you built a web- site but not used a framework. | It may also be a theoretical concept you already learned but never applied in practice. | Think about different project aspects: design, data security, web security, IDE tools, inte- gration testing, CICD, etc. There will be something. | Don’t ever leave this blank! We are all learning. |

Use this opportunity to discuss with your team who **may** do what in the project. Make use of everyone’s skill set and discuss each person’s role and responsibilities by considering how everyone will contribute. Remember to identify project work (some examples are listed below at the top of the table) and course deliverables (the bottom half of the table). You might want to change the rows depending on what suits your project and team. Understand that no one person will own a single task. Recall that this is just an incomplete example. Please explain how things are assigned in the caption below the table, or put the explanation into a separate paragraph so the reader understands why things are done this way and how to interpret your table.

| Category of Work/Features                        |   Team Member 1    |   Team Member 2    |   Team Member 3    |   Team Member 4    |   Team Member 5    |   Team Member 6    |
| ------------------------------------------------ | :----------------: | :----------------: | :----------------: | :----------------: | :----------------: | :----------------: |
| **Project Management: Kanban Board Maintenance** | :heavy_check_mark: |                    | :heavy_check_mark: |                    |                    |                    |
| **System Architecture Designt**                  |                    | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |                    |                    |
| **User Interface Design**                        | :heavy_check_mark: | :heavy_check_mark: |                    |                    |                    |                    |
| **CSS Development**                              | :heavy_check_mark: |                    |                    |                    |                    | :heavy_check_mark: |
| **Feature 1**                                    | :heavy_check_mark: |                    |                    |                    |                    |                    |
| **Feature 2**                                    | :heavy_check_mark: |                    |                    |                    |                    |                    |
| **...**                                          |                    |                    |                    |                    |                    |                    |
| **Database setup**                               |                    |                    | :heavy_check_mark: | :heavy_check_mark: |                    |                    |
| **Presentation Preparation**                     | :heavy_check_mark: |                    |                    | :heavy_check_mark: |                    |                    |
| **Design Video Creation**                        |                    | :heavy_check_mark: | :heavy_check_mark: |                    |                    |                    |
| **Design Video Editing**                         | :heavy_check_mark: | :heavy_check_mark: |                    |                    |                    |                    |
| **Design Report**                                | :heavy_check_mark: |                    |                    |                    |                    |                    |
| **Final Video Creation**                         | :heavy_check_mark: |                    |                    |                    |                    | :heavy_check_mark: |
| **Final Video Editing**                          | :heavy_check_mark: |                    |                    |                    |                    | :heavy_check_mark: |
| **Final Team Report**                            |                    | :heavy_check_mark: |                    |                    |                    |                    |
| **Final Individual Report**                      | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
