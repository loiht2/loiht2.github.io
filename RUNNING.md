# Running the Project

This guide explains how to set up and run the Thanh-Loi Hoang personal website locally for development or testing.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 18.18.0 or higher, recommended: v20 LTS)
  
  **Recommended: Install using nvm (Node Version Manager):**
  ```bash
  # Install nvm
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
  
  # Reload shell configuration
  source ~/.bashrc
  
  # Install Node.js v20 (LTS)
  nvm install 20
  nvm use 20
  
  # Verify installation
  node --version  # Should show v20.x.x
  ```

  **Alternative: Direct installation:**
  - Download from [nodejs.org](https://nodejs.org/)
  - Or install via package manager (may not provide latest version):
    ```bash
    # macOS (using Homebrew)
    brew install node
    
    # Windows (using Chocolatey)
    choco install nodejs
    ```

- **npm** (usually comes with Node.js)
  - Verify installation: `npm --version`

**Important:** The default `apt install nodejs npm` on Ubuntu provides an outdated version (v12.x). Use nvm to get the required version.

## Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone https://github.com/loiht2/loiht2.github.io.git
   cd loiht2.github.io
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```
   
   This will install all required packages listed in `package.json`, including:
   - Next.js 15.5.6
   - React 19.1.0
   - React DOM 19.1.0
   - ESLint and related tools

## Development

### Start the Development Server

Run the following command to start the development server with hot-reload:

```bash
npm run dev
```

The site will be available at:
- **Local:** `http://localhost:3000`
- **Network:** The terminal will show the network URL (e.g., `http://192.168.x.x:3000`)

### Development Features

- **Hot Reload:** Changes to files in `app/`, `components/`, and styles automatically refresh the browser
- **Fast Refresh:** React components update without losing state
- **Error Overlay:** Syntax and runtime errors display in the browser

### Project Structure

```
loiht2.github.io/
├── app/                  # Next.js App Router pages
│   ├── page.js          # Homepage (/)
│   ├── blog/            # Blog listing (/blog)
│   ├── cv/              # CV page (/cv)
│   ├── projects/        # Projects page (/projects)
│   └── posts/           # Blog posts (/posts/*)
├── components/          # Reusable React components
├── public/              # Static assets (images, fonts, etc.)
├── legacy-site/         # Original HTML site (archived)
└── package.json         # Project dependencies
```

## Production Build

### Build Static Site

To create an optimized production build:

```bash
npm run build
```

This command:
1. Compiles and optimizes all pages
2. Generates static HTML files
3. Outputs everything to the `out/` directory

### Preview Production Build

To preview the production build locally:

```bash
npx serve@latest out
```

Then open `http://localhost:3000` in your browser.

## Testing on Remote Server

If you're running this on a remote server (e.g., for testing):

1. **Expose the development server to external connections:**
   ```bash
   npm run dev -- -H 0.0.0.0
   ```

2. **Access via server IP:**
   ```
   http://YOUR_SERVER_IP:3000
   ```

3. **Ensure firewall allows port 3000:**
   ```bash
   # Ubuntu/Debian with ufw
   sudo ufw allow 3000/tcp
   ```

## Common Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install all dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Build static site for production |
| `npm start` | Start production server (after build) |
| `npm run lint` | Run ESLint to check code quality |

## Troubleshooting

### Port 3000 Already in Use

If port 3000 is already occupied, specify a different port:

```bash
npm run dev -- -p 3001
```

### Permission Errors

If you encounter permission errors during `npm install`:

```bash
# Fix npm permissions (Linux/macOS)
sudo chown -R $USER:$USER ~/.npm
sudo chown -R $USER:$USER node_modules
```

### Node Version Issues

Check your Node.js version:

```bash
node --version
```

If it's below v18, update Node.js or use a version manager like [nvm](https://github.com/nvm-sh/nvm):

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install and use Node.js v20
nvm install 20
nvm use 20
```

## Deployment

This site is configured for static export and deployment to GitHub Pages:

1. Build the site: `npm run build`
2. The `out/` directory contains the complete static site
3. Push to the `main` branch of `loiht2.github.io` repository
4. GitHub Pages automatically deploys from the root or `docs/` folder

For manual deployment, copy the contents of `out/` to your web server.

## Support

For issues or questions:
- Check the [Next.js documentation](https://nextjs.org/docs)
- Review the project's [README.md](README.md)
- Contact: loi.hoangthanh.24@gmail.com
