# Nigerian Public Service Appointment Booking System

A comprehensive appointment booking system for Nigerian Federal Ministries, built with Next.js 14, TypeScript, and Tailwind CSS.

## 🌟 Features

- **Multi-language Support**: English, Hausa, Yoruba, and Igbo
- **Comprehensive Ministry Coverage**: All 28 Federal Ministries included
- **Real-time Notifications**: Instant updates for appointments
- **Email Integration**: Automated notifications via Brevo
- **Admin Dashboard**: Complete management interface
- **Mobile Responsive**: Optimized for all devices
- **JWT Authentication**: Secure user authentication
- **Professional UI**: Government-appropriate design

## 🏛️ Supported Ministries

- Ministry of Agriculture and Rural Development
- Ministry of Aviation and Aerospace Development
- Ministry of Budget and Economic Planning
- Ministry of Communications, Innovation and Digital Economy
- Ministry of Defence
- Ministry of Education
- Ministry of Environment
- Ministry of Federal Capital Territory
- Ministry of Finance
- Ministry of Foreign Affairs
- Ministry of Health and Social Welfare
- Ministry of Housing and Urban Development
- Ministry of Humanitarian Affairs and Poverty Reduction
- Ministry of Industry, Trade and Investment
- Ministry of Information and National Orientation
- Ministry of Interior
- Ministry of Justice
- Ministry of Labour and Employment
- Ministry of Marine and Blue Economy
- Ministry of Mines and Steel Development
- Ministry of Niger Delta Development
- Ministry of Petroleum Resources (Gas)
- Ministry of Petroleum Resources (Oil)
- Ministry of Police Affairs
- Ministry of Power
- Ministry of Science, Technology and Innovation
- Ministry of Solid Minerals Development
- Ministry of Transportation
- Ministry of Water Resources and Sanitation
- Ministry of Works
- Ministry of Youth Development

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Brevo account for email services

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/YOUR_USERNAME/nigerian-appointment-booking-system.git
   cd nigerian-appointment-booking-system
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Update `.env.local` with your values:
   \`\`\`env
   JWT_SECRET=your_super_secret_jwt_key_here
   BREVO_API_KEY=your_brevo_api_key_here
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Admin Access

- **Email**: rasheedahdada@gmail.com
- **Password**: bami@1234

## 📧 Email Configuration

This system uses Brevo for email notifications. To set up:

1. Create a [Brevo account](https://www.brevo.com)
2. Get your API key from the dashboard
3. Add it to your `.env.local` file

## 🌐 Deployment

### Vercel (Recommended)

1. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard

2. **Environment Variables in Vercel**
   \`\`\`
   JWT_SECRET=your_jwt_secret
   BREVO_API_KEY=your_brevo_api_key
   \`\`\`

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🧪 Testing

### User Journey Testing
1. **Registration**: Create new user account
2. **Login**: Test authentication system
3. **Booking**: Complete appointment booking process
4. **Admin Panel**: Access admin dashboard
5. **Notifications**: Verify real-time updates
6. **Email**: Check email delivery

### Language Testing
- Switch between English, Hausa, Yoruba, and Igbo
- Verify all translations are working

### Mobile Testing
- Test on various screen sizes
- Verify touch interactions
- Check mobile navigation

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Authentication**: JWT
- **Email**: Brevo API
- **Charts**: Recharts
- **Icons**: Lucide React

## 📁 Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel pages
│   ├── api/               # API routes
│   ├── dashboard/         # User dashboard
│   └── ...
├── components/            # React components
│   ├── admin/            # Admin components
│   ├── booking/          # Booking flow components
│   └── ui/               # UI components
├── lib/                  # Utility functions
├── hooks/                # Custom React hooks
└── public/               # Static assets
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Nigerian Federal Government for ministry information
- Radix UI for accessible components
- Vercel for hosting platform
- Brevo for email services

## 📞 Support

For support and questions, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ for the Nigerian Public Service**
