# CinePhix

CinePhix is a simple yet functional web application project, ideal for those who are beginning their journey in fullstack development. This project is designed to help users discover, manage, and review movies with ease—providing a hands-on example of integrating frontend and backend technologies.

## 🚀 Live Demo

Experience CinePhix directly in your browser!  
👉 [Live Demo on GitHub Pages](https://avaazquezz.github.io/CinePhix/)

## Features

- **Movie Catalog:** Browse a comprehensive database of movies with detailed information.
- **Search & Filter:** Quickly find movies by title, genre, rating, or release year.
- **User Reviews:** Write and read reviews from other users.
- **Favorites & Watchlist:** Create your own list of favorite movies and manage your watchlist.
- **Recommendations:** Receive personalized recommendations based on your preferences.
- **Responsive Design:** Enjoy a seamless experience on desktop, tablet, and mobile devices.

## Technologies Used

- **Frontend:** React.js, Redux, HTML5, CSS3
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **APIs:** TMDb API (The Movie Database)
- **Authentication:** JWT (JSON Web Tokens)
- **Other:** Axios, Mongoose

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js and npm installed
- MongoDB instance (local or remote)
- TMDb API key (register at [The Movie Database](https://www.themoviedb.org/documentation/api))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/avaazquezz/CinePhix.git
   cd CinePhix
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Create a `.env` file in the root directory and add the following:
     ```
     MONGODB_URI=your_mongodb_uri
     TMDB_API_KEY=your_tmdb_api_key
     JWT_SECRET=your_jwt_secret
     ```

4. **Start the application:**
   ```bash
   npm start
   ```

5. **Access CinePhix locally:**
   - Open your browser and go to `http://localhost:3000`

## 🧪 Tests (Unit + E2E)

This repository ships with a basic testing setup for the frontend located in `web_app/`:

- Unit tests: Vitest + @vue/test-utils (Vue 3, jsdom)
- E2E tests: Cypress (runs against the built preview server)

### Where tests live

- Unit tests: `web_app/tests/unit/**/*.spec.js`
- E2E tests: `web_app/cypress/e2e/**/*.cy.js`

### Run tests locally

1) Install dependencies in the web app

```bash
cd web_app
npm install
```

2) Unit tests

```bash
npm run test
```

3) E2E tests (interactive)

```bash
npm run dev
# in a separate terminal
npm run cy:open
```

4) E2E tests (headless)

By default Cypress uses `baseUrl: http://localhost:3000/CinePhix`.

```bash
# Terminal 1: serve the app
npm run dev

# Terminal 2: run Cypress
npm run test:e2e
```

Environment variables: The app calls TMDB. Provide `VITE_TMDB_API_KEY` for local runs (create `web_app/.env`):

```
VITE_TMDB_API_KEY=your_tmdb_api_key
```

Tip: You can also stub TMDB calls in Cypress for faster and deterministic tests.

### Continuous Integration

GitHub Actions workflow: `.github/workflows/tests.yml`

What it does on push/PR to `main`:

1. `npm ci` in `web_app/`
2. Run unit tests (`npm run test:unit`)
3. Build the app (`npm run build`)
4. Start Vite preview on port 3000
5. Run Cypress E2E (`npm run test:e2e`)

Required secret: add `VITE_TMDB_API_KEY` at Repository Settings → Secrets and variables → Actions.

## Contributing

Contributions are welcome! If you have suggestions, ideas, or bug reports, please open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

Developed by [avaazquezz](https://github.com/avaazquezz).  
For questions or feedback, please open an issue in the repository.
