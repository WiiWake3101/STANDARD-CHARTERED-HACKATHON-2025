import React, { useEffect, useRef } from "react";

const PDFViewer = ({ fileUrl }) => {
  const viewerRef = useRef(null);

  useEffect(() => {
    const loadWebViewer = async () => {
      if (typeof window === "undefined") return; // Prevent server-side execution

      try {
        const WebViewerModule = (await import("@pdftron/webviewer")).default;

        const instance = await WebViewerModule(
          {
            path: "/lib", // Ensure assets are inside the public/lib folder
            licenseKey: "demo:1742303257275:6156c3a40300000000f93ba7ed32da6ec39018a16ee9767fe5659e1b30",
          },
          viewerRef.current
        );

        // Correct way to access annotationManager
        const annotationManager = instance.Core.documentViewer.getAnnotationManager();
        annotationManager.enableReadOnlyMode(); // Instead of setReadOnly

        instance.UI.loadDocument(fileUrl);
      } catch (error) {
        console.error("Failed to load WebViewer:", error);
        alert("Failed to load PDF viewer. Please try again later.");
      }
    };

    loadWebViewer();
  }, [fileUrl]);

  return (
    <div className="flex h-96 w-full flex-col bg-gray-50">
      <div ref={viewerRef} className="relative h-full w-full overflow-hidden rounded-lg shadow-lg" />
    </div>
  );
};

export default PDFViewer;