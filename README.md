Udyam Registration Form Clone


This project is a responsive UI form that mimics the first two steps of the Udyam registration process. It was created as an assignment focusing on web scraping, frontend development, and backend integration.

Assignment Overview
The primary goal was to replicate the initial two steps of the Udyam registration portal, which include Aadhaar and PAN validation.

Key Focus Areas:
Web Scraping: Extracting form fields, validation rules, and the UI structure from the official Udyam portal.

Frontend Development: Rebuilding the user interface with a modern framework, preferably React or Next.js.

Backend Integration: Handling form submissions, validation, and data storage.

Implemented Tasks
1. Web Scraping
Using Python with BeautifulSoup, I scraped the first two steps of the Udyam registration form to identify all input fields, labels, validation rules (like PAN and Aadhaar formats), and UI components. The scraping was performed on the website at https://udyamregistration.gov.in/UdyamRegistration.aspx.

2. Responsive UI Development
The frontend was built to replicate the Udyam form's layout with a mobile-first approach, ensuring 100% responsiveness.

The form was developed using React and TypeScript.

It includes real-time validation based on the scraped rules, such as the PAN format [A-Za-z]{5}[0-9]{4}[A-Za-z]{1}.

Bonus UI Enhancements:
An auto-fill suggestion feature was added for city and state based on the PIN code, utilizing an API like PostPin.

A progress tracker was implemented to show the user's position in Steps 1 and 2.

3. Backend Implementation
A REST API was developed to handle form data.

Technology: I used Node.js with Express and the Prisma ORM.

Functionality: The API validates form data against the scraped rules and stores the submissions in a PostgreSQL database. A database schema was designed to match the Udyam form fields.

4. Testing
Unit tests were written to ensure the reliability of the application.

Form Validation: Tests were created to check if invalid input, such as an incorrect PAN format, correctly triggers an error.

API Endpoints: Tests were also implemented for API endpoints to ensure that a POST /submit request returns a 400 status for invalid data.

Tools: Jest was used for testing the JavaScript components and logic.

Repository Link
The project code is available on GitHub at https://github.com/ApabritaSarkar/udyam_clone.

Evaluation Criteria
The project was developed with the following criteria in mind:

Scraping: Accuracy of extracted fields.

UI/UX: Pixel-perfect responsiveness, intuitive error messages, and smooth transitions.

Backend: Correctness of the REST API, validation logic, and database schema design.

Code Quality: Clean, modular code with proper comments and adherence to good Git practices.

Testing: Comprehensive coverage of edge cases, such as invalid Aadhaar or empty fields.
