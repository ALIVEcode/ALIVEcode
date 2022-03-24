# Dictionary of Definitions for ALIVEcode

## Table of content

- [General Definitions](#general-definitions)
- [User](#user)
- [Course](#course)
  - [Activity](#activity)
  - [Ressource](#ressource)
- [Class](#class)

## General Definitions

### Create

- Word used when a new element is:
  - Added to the database
  - Added to the UI
- If it makes sense to talk about the creation of an element on its own, the correct word is probably `create`
- Examples:
  - you _create_ a course
  - you _create_ a classroom
  - you _create_ a ressource

### Delete

- Word used when something that was [created][created] is deleted in:
  - The database
  - The UI
- If it makes sense to talk about the deletion of an element on its own, the correct word is probably `delete`
- This word also includes the deletion of the relationships this element may have
- Examples:
  - you _delete_ a course
  - you _delete_ a user

### Add

- Word used when a new or existing element forms a parent-child relation with another existing element
- Here, the **parent** is the one to make the relationship with the child element
- If you need to specify the parent when talking about the creation of an element, the correct word is probably `add`
- Examples:
  - you _add_ a student to a classroom
  - you _add_ a section to a course
  - you _add_ an activity to a course

### Remove

- Word used when the parent-child relationship between a child that was [added][added] to a parent is deleted
- If the child cannot be accessed outside this relationship, and it was its last parent, then this also includes the
  deletion of the child element
- If you need to specify the parent when talking about the deletion of an element, the correct word is probably `remove`
- Examples:
  - you _remove_ a section from a course
  - you _remove_ a ressource from an activity

### Join

- Word used when an **existing** and **independent** element forms a parent-child relation with another existing element
- Here, the **child** is the one to make the relationship with the parent element
- If the subject of the sentence is the element added to the parent, the correct word is probably `join`
- Examples:
  - a student _joins_ a classroom

### Leave

- Word used when the parent-child relationship between a child that [joined][joined] a parent is deleted
- If the subject of the sentence is the element leaving the parent, the correct word is probably `leave`
- Examples:
  - a student _leaves_ a classroom

## User

- A user is anyone that is logged in to his account
- There are two types of users: [Professor][Professor] and [Student][Student]
- A user can create [challenges][challenges] and play the one they can access
- A user can choose the language on the site
- A user can choose the theme on the site

### Professor

- A professor is a type of user
- A professor can [create][create] and [delete](#delete) [classes][classes]
- A professor can [create][create] and [delete](#delete) [courses][courses]
  - A professor can [add][add] and [remove](#remove) [sections][sections] in a course
  - A professor can [add][add] and [remove](#remove) [activities][activities] in a course
  - A professor can [add][add] and [remove](#remove) [ressources][ressources] in an activity
- A professor can [create][create] and [delete][delete] [ressources](#ressource)

### Student

- A student is a type of user
- A student can [join][join] and [leave](#leave) [classes][classes]
- A student can [join][join] and [leave](#leave) [courses][courses]
- A student can solve [challenges][challenges]

## Course

* A course allows a [professor][professor] to teach a skill or a subject by putting their content
  into [activities][activities], and organising activities into [sections][sections].
* A course can be [added][added] to [classes][classes] to allow [students][students] to [join][join] them.
* A course can be made public to allow any [student][student] to [join][join] it.

### Section

- A section has a role similar to a *folder* on a computer. It is a way to divide the content of the course into smaller
  chunks.
- A section can contain activities and other sections.
- The content of a section can be collapse or revealed to make traversing the content of the course easier.

### Activity

- An activity has a role similar to a *file* on a computer. It is where you will interact with the course and find its content.
- An activity has a type.
- An activity has a header, a layout and a footer.
- The header and the footer are optional zones of text where the professor can, for example, add a small description of the task or links to related topics.
- The layout of the activity:
  - Is determined by its *type*
  - Says which *type of [ressources][ressources]* are allowed and where they need to be placed in the activity.

### Ressource

- A ressource has a role similar to the *assets* of a program. Or, put in other words, they are the reusable building blocks from which the activities are made.
- A same ressource can be reused in multiple activities in multiple courses.
- A ressource has a type, which determines:
  - In what activities they are allowed to be used.
  - The information they are storing and using

### Challenge

- A challenge is a programming

## Class

[professor]: #professor
[student]: #student
[create]: #create
[created]: #create
[delete]: #delete
[add]: #add
[added]: #add
[remove]: #remove
[removed]: #remove
[join]: #join
[joined]: #join
[leave]: #leave
[left]: #leave
[activities]: #activity
[ressources]: #ressource
[challenges]: #challenge
[classes]: #class
[courses]: #course
[sections]: #section
[students]: #student
