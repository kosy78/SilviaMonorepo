import { defineConfig } from "tinacms";

const branch =
  process.env.NEXT_PUBLIC_TINA_BRANCH ||
  process.env.CF_PAGES_BRANCH ||
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "blog",
        label: "Articole blog",
        path: "src/content/blog",
        format: "mdx",
        defaultItem: () => ({
          title: "Titlu articol",
          description: "Descriere scurtă pentru pagina de blog și SEO.",
          publishedAt: new Date().toISOString(),
          draft: true,
          author: "Silvia Dinu",
        }),
        ui: {
          filename: {
            slugify: (values) => slugify(String(values.title || "articol")),
          },
          beforeSubmit: async ({ values }) => ({
            ...values,
            author: "Silvia Dinu",
          }),
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Titlu",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "Descriere scurtă",
            description:
              "Apare în lista de articole și în metadata paginii. Evitați promisiunile, diagnosticarea sau formulările alarmiste.",
            required: true,
            ui: {
              component: "textarea",
            },
          },
          {
            type: "datetime",
            name: "publishedAt",
            label: "Data publicării",
            required: true,
          },
          {
            type: "datetime",
            name: "updatedAt",
            label: "Data ultimei actualizări",
          },
          {
            type: "boolean",
            name: "draft",
            label: "Ciornă",
            description:
              "Când este activ, articolul nu apare public pe site. Dezactivați doar după verificare și aprobare.",
          },
          {
            type: "string",
            name: "author",
            label: "Autor",
            required: true,
            options: [
              {
                label: "Silvia Dinu",
                value: "Silvia Dinu",
              },
            ],
          },
          {
            type: "rich-text",
            name: "body",
            label: "Conținut articol",
            isBody: true,
            required: true,
          },
        ],
      },
    ],
  },
});
