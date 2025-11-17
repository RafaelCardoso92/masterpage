# Personal Portfolio & Masterpage

A modern, interactive portfolio website built with Next.js 16, featuring cosmic animations, music integration, and dynamic content management.

## 🌐 Live Site

**Production:** [https://rafaelcardoso.co.uk](https://rafaelcardoso.co.uk)

## ✨ Features

- 🌌 **Cosmic Background**: Dynamic starfield with planets, black holes, galaxies, and nebulas
- 🎵 **Music Player**: Scroll-based interactive music player with vinyl animations
- 💼 **Portfolio Showcase**: Projects, skills, and work experience
- 🤖 **Bella AI**: AI-powered chat assistant
- ⚡ **Admin Dashboard**: Content management for tracks, blog posts, and metrics
- 🎨 **Smooth Animations**: Framer Motion powered interactions
- 📱 **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🚀 Quick Start

### Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Docker Deployment

```bash
docker compose up -d --build
```

## 📋 Deployment Info

See [`deployment.json`](./deployment.json) for complete deployment details including:
- Live URLs and endpoints
- Cloudflare Tunnel configuration
- Docker commands
- Git repository info

### Quick Commands

```bash
# Restart production
docker compose restart

# View logs
docker logs -f masterpage

# Check Cloudflare Tunnel status
sudo systemctl status cloudflared
```

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Deployment**: Docker + Cloudflare Tunnel
- **Database**: SQLite (for tracks/blog data)

## 📁 Project Structure

```
├── src/
│   ├── app/            # Next.js app router pages
│   ├── components/     # React components
│   ├── sections/       # Page sections
│   ├── data/          # JSON data files
│   └── styles/        # Global styles
├── public/            # Static assets
├── deployment.json    # Deployment configuration
└── docker-compose.yml # Docker setup
```

## 📝 License

Personal portfolio project by Rafael Cardoso
