# QR Code Survey App

This app allows people to scan a QR code, select their membership type, and complete a survey with questions specific to their membership. The survey responses are saved in JSON files for easy export to any database later.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Setup](#setup)
- [Usage](#usage)
- [Endpoints](#endpoints)
- [File Descriptions](#file-descriptions)
- [Contributing](#contributing)
- [License](#license)

## Features

- Generates QR code that directs users to a membership selection page.
- Displays survey questions based on the selected membership type.
- Saves survey responses in JSON files.
- Simple and clean UI with HTML, CSS, and JavaScript.

## Technologies Used

- Node.js
- Express
- Body-parser
- QRCode
- HTML, CSS, and JavaScript

## Project Structure

    ```sh
        your_project/
    ├── node_modules/
    ├── public/
    │ ├── index.html
    │ ├── survey.html
    │ └── success.html
    ├── surveys/
    ├── .gitignore
    ├── app.js
    ├── package.json
    └── package-lock.json


## Setup

1. **Clone the repository:**
   
   ```sh
   git clone https://github.com/yourusername/your_project.git
   cd your_project
   ```

3. **Install Dependencies:**

    ```sh
    npm install
    ```

4. **Start the server:**

    ```sh
    node app.js
    ```


5. **Generate QR Code:**

    ```sh
    http://localhost:3000/generate-qr
    ```

This will display a QR code that directs users to the membership selection page.


5. **Scan QR Code and Select Membership:**

Scan the QR code with a mobile device or open the URL in your browser.
Select your membership type and proceed to the survey form.


##  Usage

1. Generate QR Code:

Open your browser and navigate to http://localhost:3000/generate-qr.
This will display a QR code that directs to the membership selection page.


2. Scan QR Code and Select Membership:

Scan the generated QR code with a mobile device or open the URL in your browser.
Select your membership type and proceed to the survey form.


3. Fill Out and Submit the Survey:

Fill out the survey form and submit it.
After submission, you will be redirected to a success page.


4. Check Survey Data:

Survey responses are saved in the surveys directory in JSON files named after the membership type (e.g., Adult.json).


##  Endpoints


GET /generate-qr:
Generates and displays a QR code that links to the membership selection page.

GET /select-membership:
Serves the membership selection page.

GET /survey:
Serves the survey page with questions based on the selected membership.

POST /submit-survey:
Handles survey form submission and saves the responses in JSON files.

GET /success:
Serves the success page after survey submission.

##  File Descriptions
app.js:
The main server file that handles routing and serving HTML pages.

public/index.html:
The membership selection page.

public/survey.html:
The survey page with questions based on the selected membership.

public/success.html:
The success page displayed after survey submission.

surveys/:
Directory where survey responses are saved in JSON files.

##  Contributing
Contributions are welcome! Please open an issue or submit a pull request if you would like to contribute to this project.
