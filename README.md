# Khushaank Gupta - Personal Portfolio

A premium, high-performance personal portfolio website showcasing expertise in **Finance, Systems Thinking, and Chartered Accountancy**. Built with modern web technologies and designed with a minimalist aesthetic inspired by Apple's design language.

🌐 **Live Demo:** [khushaankgupta.qzz.io](https://khushaankgupta.qzz.io)  
📂 **Repository:** [github.com/khushaank/me](https://github.com/khushaank/me)

---

## ✨ Key Features

### 🎬 Premium User Experience

- **Cinematic Loading Sequence** - Professional "curtain-raise" introduction with blur and scale animations
- **Custom Cursor** - Fluid, magnetic cursor that expands on interactive elements (desktop only)
- **Smooth Scroll Reveal** - Elements elegantly fade and slide up as they enter viewport
- **Film Grain Texture** - Subtle SVG noise overlay for a premium, textured feel
- **Dark Mode Support** - Sleek dark theme with carefully curated color palettes

### ⌨️ Advanced Interactions

- **Command Palette (`Cmd/Ctrl + K`)** - Keyboard-first navigation inspired by macOS Spotlight and VS Code
- **Floating Dock Navigation** - iOS-style mobile navigation bar with glassmorphism effects
- **Interactive Cards** - Hover effects, micro-animations, and smooth transitions throughout
- **Testimonial Carousel** - Client testimonials with automatic rotation and manual controls

### 💳 E-Commerce Integration

- **Stripe Payment Gateway** - Secure payment processing for services
- **Pricing Tiers** - Multiple service packages with featured highlights
- **Contact Forms** - Multiple touchpoints for client engagement

### 🎯 Performance & SEO

- **Zero Framework Dependencies** - Built with vanilla HTML, CSS, and JavaScript
- **Optimized Font Loading** - Inter and Bodoni Moda from Google Fonts
- **Hardware-Accelerated Animations** - Using `transform` and `opacity` for smooth 60fps
- **Full SEO Optimization** - Meta tags, Open Graph, Twitter Cards, JSON-LD structured data
- **Responsive Design** - Fully responsive from mobile (320px) to desktop (4K+)

### 🔒 Content Protection

- **Strict Mode Scripts** - Disable right-click, F12, and view source shortcuts
- **Professional Security** - Basic client-side protection for content

---

## 🛠️ Tech Stack

| Category      | Technology                                 |
| ------------- | ------------------------------------------ |
| **Structure** | Semantic HTML5                             |
| **Styling**   | CSS3 (Variables, Flexbox, Grid, Keyframes) |
| **Logic**     | Vanilla ES6+ JavaScript                    |
| **Fonts**     | Google Fonts (Bodoni Moda & Inter)         |
| **Icons**     | Font Awesome                               |
| **Payments**  | Stripe API                                 |
| **Hosting**   | GitHub Pages / Custom Domain               |

---

## 📂 Project Structure

```
/portfolio-root
│
├── index.html                    # Main entry point
├── style.css                     # Global styles and design system
├── script.js                     # Interactive features and logic
├── favicon.ico                   # Browser tab icon
├── khush.png                     # Hero section portrait
├── sitemap.xml                   # SEO sitemap
├── robots.txt                    # Search engine directives
│
├── /fragments                    # Reusable HTML components
│   ├── header.html              # Navigation header
│   └── footer.html              # Footer with legal links
│
├── /legal                        # Legal pages
│   ├── terms.html               # Terms of Service
│   └── privacy.html             # Privacy Policy
│
└── README.md                     # Documentation
```

---

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- (Optional) A local web server for development

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/khushaank/me.git
   cd me
   ```

2. **Open the project:**

   - Simply open `index.html` in your browser, or
   - Use a local development server:

     ```bash
     # Python 3
     python -m http.server 8000

     # Node.js (if you have http-server installed)
     npx http-server
     ```

3. **Visit the site:**
   - Open `http://localhost:8000` in your browser

### Configuration

**Update Personal Information:**

- Edit `index.html` to update name, bio, services, and contact details
- Replace `khush.png` with your own portrait image
- Update social media links in the footer

**Customize Colors:**
All colors are defined in CSS variables in `style.css`:

```css
:root {
  --bg-root: #f2efe9; /* Background Color */
  --accent-orange: #ff4d00; /* Highlight/Brand Color */
  --text-primary: #1a1510; /* Main Text Color */
}
```

**Stripe Integration:**

- Get your Stripe API keys from [stripe.com](https://stripe.com)
- Update the Stripe configuration in `script.js`

---

## ⌨️ Command Palette

Press **`Ctrl + K`** (Windows) or **`Cmd + K`** (Mac) to open the command palette:

- Type to filter available commands
- Use **Arrow Keys** to navigate
- Press **Enter** to execute
- Press **Escape** to close

Available commands include quick navigation to sections, contact actions, and more.

---

## 🎨 Design System

### Typography

- **Display Font:** Bodoni Moda (Serif) - For headings and emphasis
- **Body Font:** Inter (Sans-serif) - For readability and modern feel

### Color Palette

- **Primary Background:** `#f2efe9` (Warm Beige)
- **Accent Color:** `#ff4d00` (Vibrant Orange)
- **Text Primary:** `#1a1510` (Deep Brown)
- **Dark Mode:** Custom dark theme with reduced eye strain

### Animations

- **Page Load:** 0.8s fade-in with blur reduction
- **Scroll Reveal:** Elements appear with 0.6s fade + slide
- **Hover Effects:** 0.3s smooth transitions
- **Cursor:** Magnetic expansion on interactive elements

---

## 📱 Responsive Breakpoints

| Device   | Width   | Layout                        |
| -------- | ------- | ----------------------------- |
| Mobile S | 320px   | Single column, floating dock  |
| Mobile M | 375px   | Single column, floating dock  |
| Mobile L | 425px   | Single column, floating dock  |
| Tablet   | 768px   | 2-column grid, floating dock  |
| Laptop   | 1024px  | Full navigation, multi-column |
| Desktop  | 1440px+ | Full navigation, wide grids   |

---

## ⚠️ Developer Notes

### Disabling "Strict Mode" for Development

The code includes security scripts that disable:

- Right-click context menu
- F12 (DevTools)
- Ctrl+U (View Source)
- Ctrl+S (Save Page)

**To enable debugging during development**, comment out this section in `script.js`:

```javascript
/* Comment this out during development */
// document.addEventListener("contextmenu", (e) => e.preventDefault());
// document.addEventListener("keydown", (e) => { ... });
```

### Git Configuration

This project uses Git for version control:

```bash
git config --global user.name "Khushaank Gupta"
git config --global user.email "khushaankgupta@gmail.com"
```

---

## 🌐 Deployment

### GitHub Pages

1. Push your code to GitHub
2. Go to Settings → Pages
3. Select source branch (usually `main`)
4. Your site will be live at `https://yourusername.github.io/repo-name`

### Custom Domain

1. Add a `CNAME` file with your domain
2. Configure DNS settings with your domain provider
3. Enable HTTPS in GitHub Pages settings

---

## 📄 License

This project is licensed for personal use. Attribution is appreciated but not required.

**Author:** Khushaank Gupta  
**Contact:** khushaankgupta@gmail.com  
**GitHub:** [@khushaank](https://github.com/khushaank)

---

## 🙏 Acknowledgments

- Design inspiration from Apple's Human Interface Guidelines
- Font families from Google Fonts
- Icons from Font Awesome
- Payment processing by Stripe

---

**Built with ❤️ and attention to detail**
