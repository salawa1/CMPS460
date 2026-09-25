# Module 3 Homework Assignment - Event Registration App

## Description
In this application, a user can register for an event, as well as add and remove guests before hitting the "Register" button that officially displays the registration information.

## Props and State

Props are used in the "EventInfo" component. The "App" component passes "Mobile Development Workshop" through the "name" propr and EventInfo displays it.

State is used in "App" through the 3 "useState" calls. The "name" state stores the name that the user manually inputs through text, "guests" stores the guest count that is altered by the buttons, and "registered" tracks whether the user has filled in the required fields. Updating these values updates the information on the screen. The "registered" value controls if the information is rendered, given that the conditions of the other states has been fulfilled.