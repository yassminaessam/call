# CRM Call Center Application with Grandstream PBX Integration

This is a modern CRM Call Center application built with React, TypeScript, and Express.js. It features multilingual support (Arabic/English), comprehensive CRM interface, and **complete Grandstream UCM6304A PBX integration**.

## 🚀 Features

### 📞 Grandstream UCM6304A PBX Integration
- **Real-time call management and monitoring**
- **Extension status tracking and control**
- **Call queue management**
- **DTMF tone sending**
- **Call recording access**
- **Conference call creation**
- **Call transfer and parking**
- **Live call analytics and reporting**

### 🌍 Multilingual Support
- **Full Arabic and English translation system with RTL support**
- **Real-time language switching without page reload**
- **Context-aware translations for PBX interface**

### 🏢 CRM Modules
- **Call Center Dashboard**: Real-time call management and monitoring
- **Sales, HR, Marketing, Manufacturing, and Support departments**
- **AI Answering**: Intelligent call handling system
- **Modern UI**: Clean, responsive design with dark/light mode support

## 🏗️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Prisma ORM
- **PBX Integration**: Grandstream UCM6304A REST API v1.0
- **UI Components**: Radix UI, Tailwind CSS
- **Routing**: React Router
- **Translation**: Custom i18n system with locale-based JSON files

## 📱 Grandstream UCM6304A Integration

### Core Features
✅ **Call Management**: Make, answer, hold, transfer, and end calls  
✅ **Extension Monitoring**: Real-time status of all extensions  
✅ **Queue Management**: Monitor and manage call queues  
✅ **Call Recording**: Access and manage call recordings  
✅ **DTMF Control**: Send DTMF tones during active calls  
✅ **Conference Calls**: Create and manage conference calls  
✅ **Call Analytics**: Detailed call history and statistics  

### Security Features
🔐 **HTTPS Support**: Secure API communications  
🔐 **Authentication**: User-based access control  
🔐 **API Key Management**: Secure credential handling  
🔐 **Firewall Rules**: Network access restrictions  

### Configuration
Set up your Grandstream UCM6304A in the `.env` file:
```bash
GRANDSTREAM_HOST=192.168.1.100
GRANDSTREAM_PORT=8088
GRANDSTREAM_USERNAME=admin
GRANDSTREAM_PASSWORD=your_secure_password
GRANDSTREAM_API_VERSION=v1.0
```

## 📦 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Grandstream UCM6304A PBX (optional for full functionality)
- npm or yarn

### Installation

1. **Clone the repository**:
```bash
git clone <repository-url>
cd call-center-crm
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
```bash
cp .env.example .env
# Edit .env with your database and Grandstream PBX configuration
```

4. **Set up the database**:
```bash
npx prisma generate
npx prisma db push
```

5. **Build and start the application**:
```bash
npm run build
npm start
```

The application will be available at `http://localhost:3000`.

### Grandstream PBX Setup

1. **Access your UCM6304A web interface**
2. **Enable REST API** in System Settings
3. **Create API user** with appropriate permissions
4. **Configure network settings** for API access
5. **Test connection** using the built-in health check

📚 **Detailed setup instructions**: [GRANDSTREAM_SETUP_GUIDE.md](./GRANDSTREAM_SETUP_GUIDE.md)

## 🛠️ Development

- **Start development server**: `npm run dev`
- **Build for production**: `npm run build`
- **Run tests**: `npm test`
- **Type checking**: `npm run type-check`

## 🚀 Deployment

The application is configured for deployment on Vercel:

1. **Connect your GitHub repository to Vercel**
2. **Set up environment variables** in Vercel dashboard:
   - Database connection strings
   - Grandstream PBX configuration
3. **Deploy** with automatic builds on push

## 🌍 Translation System

The application uses a comprehensive translation system:

- **Translation files**: Located in `locales/[language]/[namespace].json`
- **Supported languages**: English (en), Arabic (ar)
- **RTL support**: Automatic right-to-left layout for Arabic
- **Context switching**: Real-time language switching without page reload
- **PBX Translations**: Complete Grandstream interface translations

### Adding Translations

1. Add translation keys to appropriate namespace files
2. Use the `useTranslation` hook in components
3. Run translation scan to identify missing keys

## 📁 Project Structure

```
├── client/              # Frontend React application
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components (includes GrandstreamControl)
│   ├── contexts/       # React contexts (Translation, etc.)
│   └── lib/            # Utilities and helpers
├── server/             # Backend Express application
│   ├── routes/         # API route handlers (includes grandstream.ts)
│   └── services/       # Business logic services (includes GrandstreamService)
├── locales/            # Translation files (includes Grandstream translations)
├── prisma/             # Database schema and migrations
└── dist/               # Built application files
```

## 🔌 API Endpoints

### Grandstream PBX API
- `GET /api/grandstream/status` - PBX system status
- `GET /api/grandstream/extensions` - Extension list and status
- `POST /api/grandstream/call` - Make outbound call
- `POST /api/grandstream/hangup` - End call
- `POST /api/grandstream/transfer` - Transfer call
- `GET /api/grandstream/recordings` - Call recordings
- `POST /api/grandstream/dtmf` - Send DTMF tones
- `GET /api/grandstream/queues` - Call queue status
- `POST /api/grandstream/conference` - Create conference

### Response Format
```json
{
  "success": true,
  "data": {
    "callId": "abc123",
    "status": "connected"
  },
  "message": "Call initiated successfully"
}
```

## 🔧 Troubleshooting

### Common Issues

#### 1. PBX Connection Failed
```bash
# Check network connectivity
ping 192.168.1.100

# Verify API endpoint
curl http://192.168.1.100:8088/api/v1.0/system/status
```

#### 2. Authentication Error
- Verify username/password in `.env`
- Check API user permissions in UCM web interface
- Ensure API is enabled in system settings

#### 3. Call Quality Issues
- Check network bandwidth and latency
- Verify SIP settings and codecs
- Monitor UCM system resources

## 📊 Monitoring and Analytics

### Built-in Dashboards
- **Real-time call statistics**
- **Extension performance metrics**
- **Queue efficiency reports**
- **Call quality analytics**

### Integration Support
- **Webhook notifications** for call events
- **REST API** for external monitoring tools
- **Database logging** for historical analysis

## 🛡️ Security Best Practices

1. **Change default PBX passwords**
2. **Use HTTPS in production**
3. **Restrict API access to authorized users only**
4. **Enable firewall rules for PBX access**
5. **Regular security updates for UCM firmware**
6. **Monitor API access logs**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Test Grandstream integration if modified
6. Submit a pull request

## 📞 Support

For Grandstream UCM6304A specific issues, refer to:
- [Grandstream Documentation](https://www.grandstream.com/support)
- [UCM6304A REST API Guide](./GRANDSTREAM_SETUP_GUIDE.md)
- [PBX Configuration Examples](./GRANDSTREAM_SETUP_GUIDE.md#configuration-examples)

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

### 🎉 Built with ❤️ using React, Node.js, and Grandstream UCM6304A

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Grandstream](https://img.shields.io/badge/Grandstream-UCM6304A-orange.svg)](https://www.grandstream.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma-purple.svg)](https://www.postgresql.org/)

</div>