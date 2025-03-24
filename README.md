# Skillset

Skillset is a web app designed to assist with onboarding new members of Tikkun Olam Makers: Georgia Tech/Emory.  
It consolidates and hosts information on key skills required for various projects,  
while also providing a platform to assign and track progress through learning modules.

## Features
- Centralized resource hub for technical skills
- Interactive learning modules with tracking
- AWS Amplify-powered backend

---

## **Getting Started**

### **1. Clone the Repository**
```sh
git clone https://github.com/your-repo/skillset.git
cd tom-gt-skillset
```

### **2. Install Dependencies**
```sh
npm install
```

### **3. Set Up AWS Amplify**
This app connects to a cloud backend built with **AWS Amplify (Gen 1, v6)**.  
To ensure proper connectivity, configure your Amplify environment using the CLI:

```sh
amplify pull --appId APP_ID --envName YOUR_ENV
```
APP_ID and YOUR_ENV can be found on the AWS management console in the Amplify project.

- Config files are in the `/amplify` folder.
- More details on [Amplify Gen 1](https://docs.amplify.aws/gen1/react/).

### **4. Run the App**
```sh
npm start
```
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

---

## **Project Structure**
```
/src
  ├── Components/       # Reusable UI components
  ├── Pages/            # Main app pages
  ├── utils/            # Helper functions
  ├── fonts/            # typography fonts
  ├── amplify/          # AWS Amplify configurations
  ├── Themes/           # Scss theme
  ├── Types/            # TypeScript types
  ├── SampleData/       # Sample placeholder data
```

---

## **Available Scripts**
| Command          | Description |
|-----------------|-------------|
| `npm start`     | Runs the app in development mode |
| `npm test`      | Launches the test runner |
| `npm run build` | Builds the app for production |
| `npm run eject` | Ejects from Create React App (irreversible) |

---

## **Deployment**
To deploy via Amplify, simply merge a commit into the `develop` or `master` branch, for the develop and master deployments. A workflow is set up via the Amplify console to automatically redeploy when a new commit is merged into either branch.

For manual hosting, the built app is in the `/build` directory.

---

## **Contributing**
Pull requests are welcome! Before submitting, please:
- Follow project coding guidelines.
- Run `npm test` to ensure tests pass.

---

## **License**
This project is licensed under [MIT License](LICENSE).

