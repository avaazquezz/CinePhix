# 🎬 CinePhix

A modern, responsive web application for discovering movies, TV series, and actors. Built with Vue.js and powered by The Movie Database (TMDb) API, CinePhix provides an intuitive interface for exploring trending entertainment content.

![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Vuetify](https://img.shields.io/badge/Vuetify-1867C0?style=for-the-badge&logo=vuetify&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## ✨ Features

- **🔥 Trending Content**: Discover today's most popular movies and TV series
- **🎭 Movies Browser**: Explore a vast collection of movies with detailed information
- **📺 TV Series**: Browse and discover television series across all genres
- **👥 Actor Profiles**: View detailed actor information and filmography
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **🎨 Material Design**: Beautiful, modern UI powered by Vuetify
- **⚡ Fast Performance**: Built with Vite for lightning-fast development and builds
- **🌐 Real-time Data**: Powered by The Movie Database (TMDb) API

## 🚀 Technology Stack

- **Frontend Framework**: Vue.js 3
- **UI Components**: Vuetify 3 (Material Design)
- **Build Tool**: Vite
- **Routing**: Vue Router 4
- **HTTP Client**: Axios
- **Language**: JavaScript (ES6+)
- **Styling**: SCSS/Sass
- **Icons**: Material Design Icons (MDI)

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 16.0 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A TMDb API key (see setup instructions below)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/avaazquezz/CinePhix.git
   cd CinePhix
   ```

2. **Navigate to the web application directory**
   ```bash
   cd web_app
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the `web_app` directory:
   ```bash
   touch .env
   ```
   
   Add your TMDb API key to the `.env` file:
   ```env
   VITE_TMDB_API_KEY=your_tmdb_api_key_here
   ```

## 🔑 API Configuration

### Getting a TMDb API Key

1. Visit [The Movie Database (TMDb)](https://www.themoviedb.org/)
2. Create a free account
3. Go to your account settings
4. Navigate to the API section
5. Request an API key
6. Copy your API key and add it to the `.env` file

### API Usage

The application uses TMDb API v3 with the following configuration:
- **Base URL**: `https://api.themoviedb.org/3`
- **Language**: Spanish (es-ES) - can be configured in `src/ApiController/api.js`
- **Image Base URL**: `https://image.tmdb.org/t/p/w500/`

## 💻 Development

### Running the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
CinePhix/
├── web_app/
│   ├── src/
│   │   ├── ApiController/
│   │   │   ├── services/          # API service modules
│   │   │   ├── api.js            # Axios configuration
│   │   │   └── ApiPeticions.js   # API request handlers
│   │   ├── components/           # Reusable Vue components
│   │   ├── pages/               # Page components
│   │   ├── plugins/             # Vue plugins configuration
│   │   ├── router/              # Vue Router configuration
│   │   ├── assets/              # Static assets
│   │   ├── App.vue              # Root component
│   │   └── main.js              # Application entry point
│   ├── public/                  # Public static files
│   ├── package.json            # Dependencies and scripts
│   ├── vite.config.mjs         # Vite configuration
│   └── index.html              # HTML entry point
└── README.md
```

## 🎯 Usage

### Navigation

The application includes the following main sections:

- **Home**: Trending movies and TV series
- **Movies**: Browse movie collection
- **Series**: Explore TV series
- **Actors**: Discover actor profiles

### Features Overview

1. **Browse Content**: Navigate through different categories using the top navigation bar
2. **View Details**: Click on any movie, series, or actor to view detailed information
3. **Responsive Design**: The application adapts to different screen sizes automatically
4. **Search Functionality**: Discover content through the integrated search features

## 🤝 Contributing

We welcome contributions to CinePhix! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m "Add your feature description"
   ```
5. **Push to your branch**
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Open a Pull Request**

### Development Guidelines

- Follow Vue.js best practices
- Use Vuetify components when possible
- Maintain consistent code formatting
- Add comments for complex logic
- Test your changes before submitting

## 🐛 Issues and Support

If you encounter any issues or have questions:

1. Check existing [issues](https://github.com/avaazquezz/CinePhix/issues)
2. Create a new issue with detailed description
3. Include steps to reproduce the problem
4. Provide your environment details

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [The Movie Database (TMDb)](https://www.themoviedb.org/) for providing the movie and TV data API
- [Vue.js](https://vuejs.org/) for the amazing frontend framework
- [Vuetify](https://vuetifyjs.com/) for the beautiful Material Design components
- [Vite](https://vitejs.dev/) for the fast build tool

## 📞 Contact

For questions or suggestions, feel free to reach out:

- **GitHub**: [@avaazquezz](https://github.com/avaazquezz)
- **Project Link**: [https://github.com/avaazquezz/CinePhix](https://github.com/avaazquezz/CinePhix)

---

⭐ **Star this repository if you find it helpful!**