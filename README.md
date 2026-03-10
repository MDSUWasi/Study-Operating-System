# Study Operating System

**Study Operating System** is a privacy-first, gamified productivity dashboard designed to bridge the gap between deep work and organized note-taking. Built with a modular vanilla JavaScript architecture, it offers a distraction-free environment for scholars and professionals.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Privacy](https://img.shields.io/badge/Data%20Privacy-Local%20Only-green)

---
## 🚀 Key Features

* **Chronos Hub:** A temporal mapping system (Calendar) for tracking tasks and daily routines.
* **Neural Writer:** A distraction-free, glassmorphic editor with a built-in Focus Timer for deep-work sessions.
* **Identity Module:** Personalize your workspace with custom banners, profile signatures, and UI accent colors.
* **Intelligence Stats:** Real-time visualization of your study hours and productivity logs.
* **Data Archive:** Full import/export capabilities to keep your data safe and portable.

## 🛡️ Privacy, Safety & Security

Unlike modern "Cloud-First" applications, Study Operating System is designed to be a private vault:

1.  **Zero External Requests:** The system do not calls external APIs. It uses high-quality system-UI font stacks.
2.  **No Tracking:** There are no analytics, cookies, or hidden scripts. 
3.  **Local Isolation:** Your data never touches a server. It stays in your browser's physical storage on your machine.
4.  **Open Source Transparency:** Every line of code is local and auditable.

## 💾 Where is my Data Stored?

Study Operating System utilizes **Web Storage API (LocalStorage)**. 
* **Mechanism:** Data is stored as a serialized JSON object within your browser's internal database.
* **Persistence:** Your data remains even if you close the tab or restart your computer.
* **Portability:** Use the **Data Archive** tool in the settings to download a `.json` backup. This file can be moved to any other computer running Study Operating System to restore your exact state.

## ⚙️ How It Works (Step-by-Step)

1.  **The Boot Sequence:** When you open `index.html`, the `storage.js` engine pulls your saved state from LocalStorage.
2.  **UI Initialization:** `ui.js` renders the desktop, injects your custom accent colors, and sets the system clock.
3.  **App Launching:** Clicking a launcher icon triggers the "Window Engine," which uses CSS hardware acceleration to scale up the glass containers.
4.  **Temporal Logging:** Adding a task in **Chronos** creates a new entry in the `chronosData` object, which is immediately auto-saved.
5.  **Neural Sync:** Every change you make (writing a note, changing a color, or ticking a task) triggers a "Save Pulse," keeping your database in sync.

## 🌟 What Makes Study Operating System Unique?

* **The Aesthetic:** High-end "Glassmorphism" UI that feels like a futuristic terminal rather than a standard website.
* **Speed:** Because there are no external assets to download, the system opens fast.
* **Independence:** It is designed to work even if the internet goes down. As long as you have the files, you have your System.

---

### 🛠️ Developer & Build Info
* **Language:** Vanilla JavaScript (ES6+), HTML5, CSS3.
* **Version:** 3.0
* **Author:** Md. Shafi Un Wasi

---
*Developed for the next century of digital exploration.*
