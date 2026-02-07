export const FRAMEWORKS = [
  "html",
  "tailwind",
  "react",
  "vue",
  "angular",
  "svelte",
];

export const frameworkTemplates = {
  html: {
    systemPrompt:
      "You are an expert frontend developer. Generate a clean, semantic HTML component with inline CSS.",
  },
  tailwind: {
    systemPrompt:
      "You are an expert frontend developer. Generate a component using Tailwind CSS utility classes.",
  },
  react: {
    systemPrompt:
      "You are an expert React developer. Generate a reusable React functional component using hooks.",
  },
  vue: {
    systemPrompt:
      "You are an expert Vue 3 developer. Generate a Vue Single File Component using <script setup>.",
  },
  angular: {
    systemPrompt:
      "You are an expert Angular developer. Generate a standalone Angular component with inline template.",
  },
  svelte: {
    systemPrompt:
      "You are an expert Svelte developer. Generate a Svelte component using reactive declarations.",
  },
};
