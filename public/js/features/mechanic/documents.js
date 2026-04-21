(function () {
  const STORAGE_KEY = "mechanicDocumentsDraftFiles";

  const formatSize = (bytes) => {
    if (!Number.isFinite(bytes) || bytes <= 0) return "";
    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let unit = 0;
    while (size >= 1024 && unit < units.length - 1) {
      size /= 1024;
      unit += 1;
    }
    return `${size.toFixed(size >= 10 || unit === 0 ? 0 : 1)} ${units[unit]}`;
  };

  const readDraftFiles = () => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_error) {
      return [];
    }
  };

  const writeDraftFiles = (files) => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(files));
    } catch (_error) {
      // Ignore storage failures; the live list still works.
    }
  };

  const clearDraftFiles = () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (_error) {
      // Ignore storage failures.
    }
  };

  const renderFiles = (listEl, files) => {
    if (!listEl) return;
    listEl.innerHTML = "";

    if (!files.length) {
      const empty = document.createElement("p");
      empty.className = "documents-upload-empty";
      empty.textContent = "No documents selected yet.";
      listEl.appendChild(empty);
      return;
    }

    files.forEach((file) => {
      const row = document.createElement("div");
      row.className = "documents-upload-item";

      const name = document.createElement("div");
      name.className = "documents-upload-name";
      name.textContent = file.name || "Unnamed file";

      const state = document.createElement("div");
      state.className = "documents-upload-state is-valid";
      const pieces = [];
      if (file.type) pieces.push(file.type);
      if (file.size) pieces.push(formatSize(file.size));
      state.textContent = pieces.length ? pieces.join(" • ") : "Ready to upload";

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "documents-upload-remove";
      remove.setAttribute("aria-label", `Remove ${file.name || "file"}`);
      remove.textContent = "×";

      row.append(name, state, remove);
      listEl.appendChild(row);
    });
  };

  const fileKey = (file) =>
    [file?.name || "", file?.size || 0, file?.type || "", file?.lastModified || 0].join("|");

  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("documentsUploadForm");
    const input = document.getElementById("documentsUploadInput");
    const list = document.getElementById("documentsUploadList");
    const uploadEmail = document.getElementById("docsUploadEmail");
    const nextStepEmail = document.getElementById("docsEmail");
    const uploadStatus = new URLSearchParams(window.location.search).get("upload");
    let currentFiles = [];

    if (!form || !input || !list) return;

    let storedLeadEmail = "";
    try {
      const storedLead = JSON.parse(sessionStorage.getItem("mechanicLead") || "null");
      storedLeadEmail = String(storedLead?.email || "").trim().toLowerCase();
    } catch (_error) {
      storedLeadEmail = "";
    }
    if (!storedLeadEmail) {
      const urlEmail = new URLSearchParams(window.location.search).get("email");
      storedLeadEmail = String(urlEmail || "").trim().toLowerCase();
    }

    if (uploadEmail && storedLeadEmail) uploadEmail.value = storedLeadEmail;
    if (nextStepEmail && storedLeadEmail) nextStepEmail.value = storedLeadEmail;

    if (uploadStatus === "success") {
      clearDraftFiles();
    }

    const initialFiles = uploadStatus === "success" ? [] : readDraftFiles();
    renderFiles(list, initialFiles);

    const syncInputFiles = () => {
      if (typeof DataTransfer === "undefined") return;
      const transfer = new DataTransfer();
      currentFiles.forEach((file) => transfer.items.add(file));
      input.files = transfer.files;
    };

    input.addEventListener("change", () => {
      const selectedFiles = Array.from(input.files || []);
      const mergedFiles = [...currentFiles];
      const seen = new Set(currentFiles.map((file) => fileKey(file)));
      for (const file of selectedFiles) {
        const key = fileKey(file);
        if (seen.has(key)) continue;
        seen.add(key);
        mergedFiles.push(file);
      }
      currentFiles = mergedFiles;
      const files = currentFiles.map((file) => ({
        name: file.name,
        size: file.size,
        type: (file.type || "").split("/").pop().toUpperCase() || "FILE"
      }));
      writeDraftFiles(files);
      syncInputFiles();
      renderFiles(list, files);
    });

    form.addEventListener("submit", () => {
      if (uploadEmail && !uploadEmail.value && storedLeadEmail) {
        uploadEmail.value = storedLeadEmail;
      }
      currentFiles = Array.from(input.files || []);
      const files = currentFiles.map((file) => ({
        name: file.name,
        size: file.size,
        type: (file.type || "").split("/").pop().toUpperCase() || "FILE"
      }));
      writeDraftFiles(files);
    });

    list.addEventListener("click", (event) => {
      const button = event.target.closest(".documents-upload-remove");
      if (!button) return;
      const item = button.closest(".documents-upload-item");
      if (!item) return;
      const index = Array.from(list.querySelectorAll(".documents-upload-item")).indexOf(item);
      if (index < 0) return;
      currentFiles = currentFiles.filter((_, itemIndex) => itemIndex !== index);
      const files = currentFiles.map((file) => ({
        name: file.name,
        size: file.size,
        type: (file.type || "").split("/").pop().toUpperCase() || "FILE"
      }));
      writeDraftFiles(files);
      syncInputFiles();
      renderFiles(list, files);
    });
  });
})();
