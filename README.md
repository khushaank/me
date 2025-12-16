# Portfolio: Finance & Systems Thinking

A cinematic, high-performance personal portfolio website designed for **Khushaank Gupta**. This project features a minimalist aesthetic, advanced interaction design, and a focus on "Systems Thinking" within the context of Finance and Chartered Accountancy.

It is built with **Vanilla HTML, CSS, and JavaScript** with zero external framework dependencies (no Bootstrap, Tailwind, or jQuery).

## ✨ Key Features

- **Cinematic Introduction:** A "curtain-raise" loading sequence with blur and scale animations.
    
- **Command Palette (`Cmd/Ctrl + K`):** A keyboard-first navigation menu similar to macOS Spotlight or VS Code, allowing users to jump to sections or execute actions quickly.
    
- **Custom Interaction Design:**
    
    - **Fluid Cursor:** A custom cursor that magnetically expands when hovering over interactive elements (desktop only).
        
    - **Film Grain:** A subtle SVG noise overlay for a textured, premium feel.
        
    - **Scroll Reveal:** Elements fade and slide up elegantly as they enter the viewport.
        
- **Responsive Layout:**
    
    - **Desktop:** Full navigation bar and grid layouts.
        
    - **Mobile:** A "floating dock" navigation bar at the bottom of the screen (iOS style).
        
- **Performance:**
    
    - Optimized font loading (`Inter` and `Bodoni Moda`).
        
    - No heavy libraries.
        
    - Hardware-accelerated animations (`transform`, `opacity`).
        
- **"Strict Mode" Scripts:** Includes scripts to disable Right-Click, `F12` (DevTools), and View Source shortcuts to protect content.
    

## 🛠️ Tech Stack

- **Structure:** Semantic HTML5
    
- **Styling:** CSS3 (CSS Variables, Flexbox, Grid, Keyframes)
    
- **Logic:** Vanilla ES6 JavaScript
    
- **Fonts:** Google Fonts (Bodoni Moda & Inter)
    
- **Icons:** Native Unicode Emojis (for lightweight performance)
    

## 📂 Project Structure

Plaintext

```
/portfolio-root
│
├── index.html        # The main entry point containing all code (HTML/CSS/JS)
├── favicon.png       # (Required) Browser tab icon
└── khush.png         # (Required) The main portrait image for the hero section
```

## 🚀 Getting Started

### 1. Prerequisites

You only need a modern web browser (Chrome, Firefox, Safari, Edge). No Node.js or build tools are required.

### 2. Setup

1. Create a folder for your project.
    
2. Save the provided code as `index.html`.
    
3. **Important:** Add an image named `khush.png` to the same folder (or update the `src` attribute in the HTML to point to your own image).
    
4. (Optional) Add a `favicon.png` for the tab icon.
    

### 3. Running the Site

Simply double-click `index.html` to open it in your browser.

## ⌨️ Command Palette Usage

The site features a hidden power-user menu.

1. Press **`Ctrl + K`** (Windows) or **`Cmd + K`** (Mac).
    
2. A modal will appear.
    
3. Type to filter commands (e.g., "Work", "Email", "Profile").
    
4. Use **Arrow Keys** to navigate and **Enter** to select.
    

## ⚠️ Developer Note: "Strict Mode"

The code includes a section labeled `// 2. Strict Security`. This block **disables** the following to prevent users from inspecting the code:

- Right-click context menu.
    
- `F12` (DevTools).
    
- `Ctrl+U` (View Source).
    
- `Ctrl+S` (Save Page).
    

**If you are editing the code:** You may want to comment out this section in the `<script>` tag at the bottom of the file so you can inspect elements and debug your changes.

JavaScript

```
/* Comment this out during development */
// document.addEventListener("contextmenu", (e) => e.preventDefault());
// document.addEventListener("keydown", (e) => { ... });
```

## 🎨 Customization Guide

### Changing Colors

All colors are defined in the CSS `:root` at the top of the `<style>` block. Change these variables to alter the theme:

CSS

```
:root {
  --bg-root: #f2efe9;       /* Background Color */
  --accent-orange: #ff4d00; /* Highlight/Brand Color */
  --text-primary: #1a1510;  /* Main Text Color */
}
```

### Changing the Name/Content

1. **Title:** Update the `<title>` tag in the `<head>`.
    
2. **Hero Text:** Search for `<h1>Order within<br /><span>Chaos.</span></h1>` to change the main headline.
    
3. **Command Palette:** Locate the `const commands = [...]` array in the `<script>` tag to add or remove shortcuts.
    

## 📄 License

This project is open for personal use. Attribution is appreciated but not required.
