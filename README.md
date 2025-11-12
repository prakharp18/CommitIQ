# 🧠 CommitIQ

**CommitIQ** is a comprehensive GitHub analytics dashboard that delivers deep insights into your development activity, repository statistics, and contribution patterns — all in one interactive and visually engaging interface.

---

## 🚀 Features

### 🖥️ Dashboard Analytics
- **Repository Overview:** Total repositories, public/private breakdown, stars, forks, and watchers  
- **Contribution Tracking:** Real-time contribution counts with streak analysis  
- **Language Distribution:** Visual breakdown of programming languages used  
- **Activity Heatmap:** GitHub-style contribution calendar with daily activity  
- **Code Quality Metrics:** Automated scoring based on repository engagement and activity  

### 📈 Advanced Visualizations
- **Weekly Activity Charts:** Track your coding patterns over time  
- **Progress Tracking:** Visual indicators for metric growth and consistency  
- **Interactive Tooltips:** Get detailed info on hover for every chart  
- **Responsive Design:** Optimized for both desktop and mobile  

### ⚡ Real-time Data
- **GitHub API Integration:** Uses GitHub REST & GraphQL APIs for accurate data  
- **Live Updates:** Refresh manually to get the latest stats instantly  
- **Secure Authentication:** OAuth integration for safe GitHub login  
- **Rate Limit Handling:** Smart API management prevents request throttling  

---

## 🛠️ Tech Stack

### Frontend
- React 18 (with Hooks & modern patterns)  
- Vite for blazing-fast development and builds  
- Tailwind CSS for utility-first styling  
- Framer Motion for smooth UI animations  
- Recharts for interactive data visualizations  
- Lucide React for consistent and clean iconography  

### Backend
- Node.js with Express.js  
- JWT Authentication for secure sessions  
- Axios for API communication  
- GitHub REST & GraphQL APIs  
- CORS enabled for secure cross-origin requests  

---

## 📊 Analytics Capabilities

### 🧩 Repository Analytics
- Repository count and categorization  
- Star/Fork ratios and engagement metrics  
- Language diversity analysis  
- Repository size and activity tracking  

### 🕒 Contribution Analytics
- Total contributions (all-time)  
- Daily, weekly, and monthly activity patterns  
- Streak tracking (current and longest)  
- Commit activity across multiple repositories  

### ⚙️ Performance Metrics
- Code quality scoring algorithm  
- Repository engagement analysis  
- Activity consistency tracking  
- Impact measurement (stars + forks)  

---

## 🔧 Architecture Overview

### 🧱 Client–Server Architecture
- React SPA frontend with React Router for navigation  
- RESTful Express backend with modular routing  
- Token-based authentication for secure GitHub API access  
- Global state management using Context Providers  

### 🔄 Data Flow
1. User authenticates via **GitHub OAuth**
2. Server fetches user data via **GitHub APIs**
3. Client receives processed analytics and metrics
4. Manual refresh triggers real-time updates
5. Smooth animated UI updates reflect new data  

---

## 📡 API Endpoints

| Endpoint | Description |
|-----------|-------------|
| `/api/auth/*` | Authentication & session management |
| `/api/github/user` | Fetch user profile information |
| `/api/github/repos` | Get repository data (supports pagination) |
| `/api/github/stats` | Get computed statistics & metrics |
| `/api/github/contributions` | Analyze contributions & streaks |

---

## 🧰 Core Features
- ✅ Pagination for users with 100+ repositories  
- ⚠️ Comprehensive error handling with fallbacks  
- ⏳ Smooth loading indicators throughout  
- 🪵 Debug logging for development & troubleshooting  




