# System Design

## Introduction

Start with a brief introduction of **what** you are building, reminding the reader of the high-level usage scenarios (project purpose).   Complete each section with the required components.  Don't forget that you can include [images in your markdown](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#images).  

Start each section with a lead-in, detailing what it is.  Also, do not just have a collection of images.   Each diagram must be explained clearly. **Do not assume that the reader understands the intentions of your designs**.

GradeFalcon is an Optical Mark Recognition System for managing the automatic grading of students' bubble sheets. Teachers will be able to create exams for classes, create the formats for exams, have submitted PDFs accurately marked from the exam's answer key and visualize various class performance metrics. Students will be able to have their submissions returned to them with the correct and incorrect answers highlighted and report if the system has made any error in marking. Administrators will have full privilege over all system data.


## System Architecture Design

Recall the system architecture slides and tell us which architecture pattern you are using and why (it may also be something not in the slides or be a combination). Provide more details about the components you have written, and where these components fit in the overall architecture so we can visualize how you have decomposed your system. Basically, this should all be captured in ONE diagram with the components on them and a few sentences explaining (i) why you chose this architecture and (ii) why the components are where you put them. If you want to just focus on a certain aspect of your system and not show the entire architecture for your system in the diagram, that should be fine as well.

GradeFalcon will implement the layered architecture approach for it's system design.

![System Architecture Design](system_architecture.jpg "System Architecture Design")

We deemed the Model-View Controller (MVC) architecture to be most suitable for implementation in this project. MVC is especially an ideal solution for projects at this scale and provides sufficient isolation between various components in the system (frontend, backend management and the exam grader), which allows us to develop them in parallel and improve ease of testing. Such compartmentalization ensures components will only have access to data that they absolutely need.

Our frontend represents the view as it includes all user interface and presentation elements. The database is the model, defining the app's data storage mechanism and the backend is the controller, allowing changes in the database to be reflected in the frontend view. Components like the exam generator and OMR Grader are all part of of server-side processing as they would be too strenuous to execute on the client side.  

## Use Case Models

Extending from your requirements, the team will need to develop a set of usage scenarios for each user group documented as properly dressed use cases  (including diagrams following the UML syntax and descriptions as presented in class). You may also want to include journey lines with some use cases.

![Use Cases](use_cases.png "Use Cases")

## Database Design 

Provide an ER diagram of the entities and relationships you anticipate having in your system (this will most likely change, but you need a starting point).  In a few sentences, explain why the data is modelled this way and what is the purpose of each table/attribute.  For this part, you only need to have ONE diagram and an explanation.

!["ER Diagram](er_diagram.jpg "ER Diagram")

## Data Flow Diagram (Level 0/Level 1)

The team is required to create comprehensive Level 0 and Level 1 Data Flow Diagrams (DFDs) to visually represent the system’s data flow, including key processes, data stores, and data movements.  The deliverables will include a high-level context diagram, a detailed Level 1 DFD, and supporting documentation to facilitate the understanding of data movement within the system.   Remember that within a L1 DFD, the same general level of abstraction should apply to all processes (review 310 notes for guidance),

## User Interface (UI) Design

The team is required to put forward a series of UI mock-ups that will be used as starting points for the design of the system   They can be minimal but the team will need to  have at least made some choices about the interaction flow of the application.  You should consider the different major aspects of user interactions and develop UI mockups for those (think about the different features/use cases and what pages are needed; you will have a number most likely).  Additionally, create a diagram to explain the navigation flow for the MVP  prototype (and any alternate flows).  When considering your UI, think about usability, accessibility, desktop and mobile uses.  As a team, you will need to discuss design choices for the system.
