# 📘 Bhagavad Gita App (CDN Based)

A lightweight, fast, and auto-updating **Bhagavad Gita Web App** built using HTML, CSS, and JavaScript.
It uses the **BhagavadGitaAPI CDN** which provides all chapters, shloks, transliteration, and detailed English translations.

---

## 🚀 Features

* ✔ Fetches all **18 chapters** directly from CDN
* ✔ Displays **all shloks** with Sanskrit, Transliteration, and English meaning
* ✔ No JSON files required — completely **online & auto-updating**
* ✔ Clean UI with responsive design
* ✔ Chapter-wise navigation

---

## 📁 Project Structure

```
/ (root)
│
├── index.html
├── CSS/
│   └── style.css
├── JavaScript/
│   ├── script.js
│   └── chapter.js
└── Pages/
    └── chapter.html
```

---

## 🌐 API Endpoints Used

This app uses the following CDN routes from **bhagavadgitaapi.in**:

### 🔹 1. Get All Chapters

```
GET https://bhagavadgitaapi.in/chapters/
```

### 🔹 2. Get Complete Chapter With All Shloks

```
GET https://bhagavadgitaapi.in/chapter/:ch/
```

Example:

```
https://bhagavadgitaapi.in/chapter/1/
```

### 🔹 3. Get Single Shlok

```
GET https://bhagavadgitaapi.in/slok/:ch/:sl
```

Example:

```
https://bhagavadgitaapi.in/slok/2/11
```

---

## 🖥 How It Works

### ✔ `index.html`

Loads all chapters from CDN and displays them on the homepage.

### ✔ `chapter.html`

Displays the full set of shloks of the selected chapter.

### ✔ `script.js`

* Loads chapter list from API
* Handles dark mode toggle
* Redirects to chapter page

### ✔ `chapter.js`

* Fetches all shloks in a chapter
* Displays Sanskrit + Transliteration + Meaning
* Applies dark mode

---

## 🌙 Dark Mode

Theme is saved in `localStorage`, so when the user reopens the app, it remembers the theme.

---

## 🏁 How to Run

1. Download the project folder
2. Open it in VS Code
3. Install Live Server (if not installed)
4. Right-click on **index.html** → **Open with Live Server**

The app is now ready to use.

---

## ❤️ Credits

* Data API: **BhagavadGitaAPI.in**
* Developed by: *Vaishali’s Gita App*

---

## 📌 Future Improvements (Optional)

You can request these features and I will create them:

* Audio pronunciation for each shlok
* Search bar (search shlok by word)
* ✔ **Dark / Light Mode** with automatic save in LocalStorage
* Favourite shloks (save in localStorage)
* Share shlok as image
* Beautiful animations

---

If you need **APK version**, **PWA**, or **better UI**, just as
