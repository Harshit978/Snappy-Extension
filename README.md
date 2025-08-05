# 📸 Snap Doc — Screenshot Collator

A powerful Chrome extension that allows you to capture multiple screenshots and export them into a single, professional Word document. 
Perfect for creating documentation, test reports, tutorials, and visual guides.

## ✨ Features

- **Easy Screenshot Capture**: Click to capture screenshots of any webpage
- **Live Preview**: See thumbnail previews of all captured screenshots
- **Custom Document Titles**: Set your own title for the exported document
- **Multiple Image Sizes**: Choose from small, medium, or large image sizes
- **Bulk Operations**: Clear all screenshots with one click
- **Real-time Counter**: See how many screenshots you've captured
- **Professional Export**: Generate clean, formatted Word documents (.docx)
- **Session Persistence**: Screenshots are saved even if you close the popup

## 🚀 Quick Start

### Installation

1. **Download or Clone** this repository
2. **Open Chrome** and navigate to `chrome://extensions/`
3. **Enable Developer Mode** (toggle in the top right)
4. **Click "Load unpacked"** and select the project folder
5. **Pin the extension** to your toolbar for easy access

### Basic Usage

1. **Navigate** to any webpage you want to capture
2. **Click** the Snap Doc extension icon in your toolbar
3. **Take Screenshots**: Click "Take Screenshot" to capture the current view
4. **Customize**: Set a custom document title and choose image size
5. **Export**: Click "Export DOCX" to download your document

## 📖 User Guide

### Taking Screenshots

- Click the **"Take Screenshot"** button to capture the currently visible area of the webpage
- Screenshots appear as thumbnails in the popup
- The counter shows how many screenshots you've captured

### Customizing Your Document

**Document Title**
- Change the title in the "Document Title" field
- This becomes the main heading in your exported document
- Default: "Test Run Snapshots"

**Image Size Options**
- **Small (300x200)**: Compact images, good for many screenshots
- **Medium (500x300)**: Balanced size, recommended for most use cases
- **Large (700x450)**: High detail, best for detailed documentation

### Managing Screenshots

- **Clear All**: Remove all captured screenshots (with confirmation)
- **Counter**: Shows "X screenshots" to track your progress
- **Thumbnails**: Visual preview of captured images

### Exporting

1. Set your desired document title
2. Choose your preferred image size
3. Click **"Export DOCX"**
4. The file downloads automatically with format: `your_title_timestamp.docx`

## 🛠️ Technical Overview

### Project Structure

```
snap-doc-extension/
├── manifest.json          # Extension configuration
├── background/
│   └── background.js      # Service worker for screenshot capture
├── popup/
│   ├── popup.html        # Extension popup interface
│   ├── popup.css         # Styling for the popup
│   ├── popup.js          # Main extension logic
│   └── libs/
│       └── docx.min.js   # DOCX generation library
└── icons/                # Extension icons (16, 32, 48, 128px)
```

### Key Technologies

- **Chrome Extension Manifest V3**: Modern extension framework
- **Chrome APIs**: `tabs`, `storage`, `activeTab` permissions
- **docx.js**: JavaScript library for creating Word documents
- **HTML5 Canvas**: For screenshot capture
- **Vanilla JavaScript**: No external frameworks for lightweight performance

### Architecture

1. **Background Script** (`background.js`): Handles screenshot capture using Chrome's `captureVisibleTab` API
2. **Popup Interface** (`popup.html/css/js`): Main user interface for managing screenshots and settings
3. **Storage**: Uses Chrome's session storage to persist screenshots across popup sessions
4. **Document Generation**: Converts screenshots to Word document using docx.js library

## 🔧 Development

### Prerequisites

- Google Chrome browser
- Basic knowledge of JavaScript, HTML, CSS
- Understanding of Chrome Extension development (helpful but not required)

### Setting Up Development Environment

1. **Load in Chrome**:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the project folder

2. **Make changes** and reload the extension to test

### Making Modifications

**Adding New Features**:
- Modify `popup.html` for UI changes
- Update `popup.js` for functionality
- Adjust `popup.css` for styling
- Update `manifest.json` for new permissions

**Debugging**:
- Use Chrome DevTools on the popup (right-click popup → "Inspect")
- Check the extension's service worker in `chrome://extensions/` → "Inspect views: service worker"
- Console logs appear in respective DevTools

### Code Style Guidelines

- Use modern JavaScript (ES6+)
- Follow consistent indentation (2 spaces)
- Comment complex logic
- Use meaningful variable names
- Keep functions small and focused

## 📝 Code Examples

### Capturing a Screenshot

```javascript
// In popup.js
captureBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "CAPTURE_SCREENSHOT" }, ({ dataUrl }) => {
    snapshots.push(dataUrl);
    chrome.storage.session.set({ snapshots });
    renderThumb(dataUrl);
    updateUI();
  });
});
```

### Creating DOCX Document

```javascript
// Generate Word document
const doc = new docx.Document({
  sections: [{
    properties: {},
    children: children // Array of paragraphs and images
  }]
});

const blob = await docx.Packer.toBlob(doc);
// Download logic...
```

## 🐛 Troubleshooting

### Common Issues

**Extension not loading**:
- Check if all files are in correct directories
- Verify `manifest.json` syntax
- Ensure Chrome Developer Mode is enabled

**Screenshots not capturing**:
- Verify the active tab has content
- Check if the page allows screenshots (some sites block it)
- Ensure you have the required permissions

**Export not working**:
- Check browser console for JavaScript errors
- Verify `docx.min.js` is properly loaded
- Ensure you have screenshots to export

**Empty document generated**:
- Verify screenshots were captured successfully
- Check image data format compatibility
- Try with different image sizes

### Contribution Ideas

- Add support for other export formats (PDF, HTML)
- Implement screenshot annotations
- Add keyboard shortcuts
- Improve UI/UX design
- Add screenshot editing features
- Support for full-page screenshots
- Add screenshot organization features
