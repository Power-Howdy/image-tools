# Image Tools

A modern, client-side web app for common image operations. All processing runs in your browser—no images are uploaded to any server.

## Features

- **Compress** — Reduce file size with adjustable quality
- **Resize** — Change dimensions with optional aspect ratio lock
- **Crop** — Crop images with a visual editor
- **Remove BG** — Remove backgrounds using AI (runs locally in browser)
- **Base64** — Encode images to base64 string (copy or download)
- **PNG → JPG** — Convert PNG images to JPG
- **WEBP → PNG** — Convert WebP images to PNG

## Tech Stack

- [Next.js 15](https://nextjs.org/)
- [React 19](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [@imgly/background-removal](https://github.com/imgly/background-removal-js)
- [browser-image-compression](https://github.com/Donaldcwl/browser-image-compression)
- [react-image-crop](https://github.com/DominicTobias/react-image-crop)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and customize:

```bash
cp .env.example .env.local
```

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Site URL for OG images and canonical links (required for production) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Contact email (optional) |
| `NEXT_PUBLIC_TWITTER_URL` | Twitter/X profile URL (optional) |
| `NEXT_PUBLIC_INSTAGRAM_URL` | Instagram profile URL (optional) |
| `NEXT_PUBLIC_INDIEHACKERS_URL` | Indie Hackers profile URL (optional) |
| `NEXT_PUBLIC_GITHUB_URL` | GitHub repo URL (optional) |

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

## Contributing

Contributions are welcome. Please read our [Code of Conduct](CODE_OF_CONDUCT.md) and open an issue or pull request.

## License

MIT
