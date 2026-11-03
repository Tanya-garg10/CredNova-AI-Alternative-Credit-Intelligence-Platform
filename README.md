<div align="center">
  <h1>🏦 CredNova AI - Alternative Credit Intelligence Platform</h1>
  <p>AI-powered alternative credit scoring for unbanked individuals, rural communities, and gig workers</p>
</div>

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-18+-green.svg)
![React](https://img.shields.io/badge/react-19+-blue.svg)

## 🌟 Features

- **Alternative Credit Scoring**: Evaluate creditworthiness without traditional bank records
- **Gig Worker Intelligence**: Seasonality-aware scoring for freelancers and gig workers
- **Bilingual Support**: Hindi and English language support
- **AI Financial Advisor**: Real-time AI-powered financial coaching
- **Fairness Monitoring**: Built-in bias detection and fairness metrics
- **Interactive Dashboard**: Visual score breakdowns and loan simulations
- **Credit Passport**: Downloadable credit history reports

## 🚀 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS 4
- **3D Visualization**: Three.js
- **AI Integration**: Featherless AI (Llama 3.3 70B)
- **Charts**: Recharts
- **Build Tool**: Vite 8

## 📋 Prerequisites

- Node.js 18 or higher
- npm or bun
- Featherless API key (get free at [featherless.ai](https://featherless.ai))

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Tanya-garg10/CredNova-AI-Alternative-Credit-Intelligence-Platform.git
   cd CredNova-AI-Alternative-Credit-Intelligence-Platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```bash
   FEATHERLESS_API_KEY="your_featherless_api_key_here"
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

## 🏗️ Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
crednova-ai/
├── src/
│   ├── components/       # React components
│   ├── services/         # Business logic & scoring engine
│   ├── i18n/            # Translations (Hindi/English)
│   └── types/           # TypeScript type definitions
├── ml_pipeline/         # Machine learning models
└── public/              # Static assets
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Tanya Garg** - Initial work

## 🙏 Acknowledgments

- Featherless AI for providing affordable AI inference
- Open-source community for amazing tools and libraries
