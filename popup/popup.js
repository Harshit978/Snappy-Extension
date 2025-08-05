/* global docx */
const captureBtn = document.getElementById("capture-btn");
const exportBtn = document.getElementById("export-btn");
const clearAllBtn = document.getElementById("clear-all-btn");
const thumbs = document.getElementById("thumbs");
const counter = document.getElementById("counter");
const documentTitle = document.getElementById("document-title");
const imageSize = document.getElementById("image-size");

let snapshots = [];

// Restore any cached snaps (survive popup reopen)
chrome.storage.session.get(["snapshots"], res => {
  snapshots = res.snapshots || [];
  snapshots.forEach(renderThumb);
  updateUI();
});

captureBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "CAPTURE_SCREENSHOT" }, ({ dataUrl }) => {
    snapshots.push(dataUrl);
    chrome.storage.session.set({ snapshots });
    renderThumb(dataUrl);
    updateUI();
  });
});

clearAllBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all screenshots?")) {
    snapshots = [];
    chrome.storage.session.remove(["snapshots"]);
    thumbs.innerHTML = "";
    updateUI();
  }
});

exportBtn.addEventListener("click", async () => {
  try {
    const title = documentTitle.value.trim() || "Test Run Snapshots";
    const sizeOption = imageSize.value;

    // Get image dimensions based on selection
    const imageSizes = {
      small: { width: 300, height: 200 },
      medium: { width: 500, height: 300 },
      large: { width: 700, height: 450 }
    };
    const { width, height } = imageSizes[sizeOption];

    // Create paragraphs array for the document
    const children = [
      new docx.Paragraph({
        text: title,
        heading: docx.HeadingLevel.HEADING_1
      }),
      new docx.Paragraph({
        text: `Generated on: ${new Date().toLocaleString()}`,
        spacing: { after: 400 }
      })
    ];

    // Add each snapshot to the document
    for (let idx = 0; idx < snapshots.length; idx++) {
      const dataUrl = snapshots[idx];
      const base64 = dataUrl.split(",")[1];
      const imageBuffer = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

      // Add screenshot title
      children.push(
        new docx.Paragraph({
          text: `Screenshot ${idx + 1}`,
          spacing: { before: 400, after: 200 }
        })
      );

      // Add the image with selected dimensions
      children.push(
        new docx.Paragraph({
          children: [
            new docx.ImageRun({
              data: imageBuffer,
              transformation: {
                width: width,
                height: height
              }
            })
          ],
          spacing: { after: 400 }
        })
      );
    }

    // Create the document with proper structure
    const doc = new docx.Document({
      sections: [{
        properties: {},
        children: children
      }]
    });

    // Generate and download the document
    const blob = await docx.Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const sanitizedTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    a.download = `${sanitizedTitle}_${Date.now()}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Reset state
    snapshots = [];
    chrome.storage.session.remove(["snapshots"]);
    thumbs.innerHTML = "";
    updateUI();
  } catch (error) {
    console.error("Error creating DOCX:", error);
    alert("Error creating document. Please try again.");
  }
});

function renderThumb(dataUrl) {
  const img = document.createElement("img");
  img.src = dataUrl;
  thumbs.appendChild(img);
}

function updateUI() {
  const count = snapshots.length;
  counter.textContent = `${count} screenshot${count !== 1 ? 's' : ''}`;
  exportBtn.disabled = count === 0;
  clearAllBtn.disabled = count === 0;

  if (count === 0) {
    thumbs.innerHTML = '<div class="empty-state">No screenshots captured yet.<br>Click "Take Screenshot" to get started!</div>';
  }
}
