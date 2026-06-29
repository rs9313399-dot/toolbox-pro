# Toolbox Pro

Toolbox Pro is a browser-based utility suite built with Next.js. It brings everyday creator, developer, PDF, image, SEO, and productivity tools into one fast web interface.

## Highlights

- Image tools: compressor, resizer, background remover, and image-to-PDF conversion.
- PDF tools: PDF-to-image and image-to-PDF workflows.
- Developer tools: JSON formatter, Base64 encoder/decoder, URL shortener, and QR code generator.
- Writing tools: word counter, text-to-speech, and speech-to-text.
- Creator tools: YouTube thumbnail downloader and Instagram reel helper.
- Security tool: password generator.
- Blog pages and SEO content for discoverability.
- Privacy, terms, disclaimer, contact, and FAQ pages.

## Tech Stack

| Area | Tools |
| --- | --- |
| Framework | Next.js, React, TypeScript |
| Styling | Tailwind CSS, Radix UI, shadcn/ui patterns |
| Tools and media | jsPDF, PDF.js, QR code generation, browser APIs |
| UI | Lucide React, Framer Motion, Sonner |
| Deployment | Standalone Next.js output |

## Project Structure

```text
toolbox-pro/
├── public/                    # Logos, blog images, sitemap, robots, ads file
├── src/app/                   # Next.js app and API route
├── src/components/            # Pages, layout, blog, FAQ, legal pages
├── src/components/tools/      # Individual utility tools
├── src/hooks/                 # Shared hooks
└── src/lib/                   # Helpers and utilities
```

## Available Tools

- Background remover
- Base64 encoder and decoder
- Image compressor
- Image resizer
- Image to PDF
- PDF to image
- JSON formatter
- Password generator
- QR code generator
- Speech to text
- Text to speech
- URL shortener
- Word counter
- YouTube thumbnail downloader
- Instagram reel helper

## Getting Started

```bash
git clone https://github.com/rs9313399-dot/toolbox-pro.git
cd toolbox-pro
bun install
bun run dev
```

Open `http://localhost:3000`.

## Useful Scripts

| Command | Purpose |
| --- | --- |
| `bun run dev` | Start the development server |
| `bun run build` | Build the standalone production app |
| `bun run start` | Start the standalone production server |
| `bun run lint` | Run lint checks |

## Notes

- Several tools run directly in the browser and do not require server-side storage.
- API-backed tools may require additional route configuration before public deployment.

## Author

Built by [Ratnesh Singh](https://github.com/rs9313399-dot).

