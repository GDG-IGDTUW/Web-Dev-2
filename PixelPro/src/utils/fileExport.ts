


export const downloadComponent = (code: string, extension: string) => {
  let finalCode = code;

  // Agar user HTML maang raha hai, toh pura valid HTML document bana do
  if (extension === "html") {
    finalCode = `<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  ${code}
</body>
</html>`;
  } 
  
  // Agar user TSX maang raha hai, toh ensure karo wo React component jaisa dikhe
  else if (extension === "tsx" && !code.includes("export default")) {
    finalCode = `import React from 'react';\n\nexport default function Component() {\n  return (\n    <>\n      ${code}\n    </>\n  );\n}`;
  }

  // File Download Process
  const blob = new Blob([finalCode], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `pixelpro-export.${extension}`;
  link.click();
  URL.revokeObjectURL(url);
};