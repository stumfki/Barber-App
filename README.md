**Barber App Documentation**

**Introduction:**

The Angular Barber App is a responsive application built with Angular 11 and Angular Material UI components. It is designed to help users book appointments with a barber, by selecting a preferred date and time. The app uses reactive forms to verify user data and filters out other dates and times that have already been booked by other users. The backend of the app is mocked by a JSON mock backend, and once the user successfully books an appointment, the date and time are saved in Unix time and sent to the backend server. The app also uses Tailwind CSS for styling.

**Getting Started:**

To get started with the Angular Barber App, you need to have Node.js installed on your machine. Once you have Node.js installed, you can download the app source code from the GitHub repository and install the dependencies using the following command:

npm install

**Running the App:**

To run the Angular Barber App, you can use the following command in the terminal:

npm start
This will start a local server on your machine, and you can access the app by opening a web browser and navigating to http://localhost:4200/

**Using the App:**

The Angular Barber App has a simple and user-friendly interface, with a landing page that displays a calendar widget and a list of available time slots. The user can select a date and time from the calendar widget and then choose a time slot from the list of available time slots. The user is required to provide their name, email, and phone number to book an appointment. The app uses reactive forms to verify the user's data, and the user will receive an error message if any of the required fields are missing or if the data is not valid.

Once the user successfully books an appointment, the app will send the data to the backend server and mark the selected date and time as unavailable for future bookings. The app will also filter out other dates and times that have already been booked by other users, to ensure that the user can only select available time slots.

**Conclusion:**

The Angular Barber App is a responsive and user-friendly application that helps users book appointments with a barber. It uses reactive forms to verify user data, filters out other dates and times, and has its own mocked backend. The app is built with Angular Material UI components and Tailwind CSS for styling, and is easy to use and customize.
