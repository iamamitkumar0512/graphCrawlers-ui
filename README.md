# Hypergraph Knowledge Management App

A Next.js application that demonstrates how to publish and manage content across private and public Hypergraph spaces. This app allows companies to scrape content from platforms like Medium, store it in private spaces, and selectively publish it to public spaces for broader visibility.

## 🚀 Features

- **Role-based Access**: Switch between User and Admin modes
- **Content Management**: Import and manage company content from external sources
- **Dual Publishing**: Publish content to both private and public Hypergraph spaces
- **Public Knowledge Exploration**: Browse and explore public content across different categories
- **Real-time Authentication**: Secure access using Hypergraph authentication
- **Responsive Design**: Modern UI with Tailwind CSS

## 🏗️ Architecture

### Application Flow

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Data Sources  │    │   Private Space  │    │  Public Spaces  │
│   (Medium, etc) │───▶│  (Content Mgmt)  │───▶│  (Public View)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   Backend API    │
                    │ (Content Scraping)│
                    └──────────────────┘
```

### Core Components

#### 1. **Data Flow**

- **Scraping**: Content is scraped from company sources (Medium links)
- **Storage**: Raw content stored in backend database
- **Processing**: Content transformed into structured format
- **Publishing**: Content published to Hypergraph spaces

#### 2. **Space Management**

- **Private Spaces**: Content management and curation
- **Public Spaces**: Public-facing content discovery
- **Cross-space Publishing**: Seamless content distribution

## 📁 Project Structure

```
my-hypergraph-app/
├── app/                          # Next.js App Router pages
│   ├── explore-public-knowledge/ # Public content exploration
│   │   ├── assets/              # Digital assets
│   │   ├── dapps/               # Decentralized applications
│   │   ├── investment-rounds/   # Funding information
│   │   └── projects/            # Project listings
│   ├── private-space/           # Private space management
│   ├── public-space/            # Public space viewing
│   ├── login/                   # Authentication
│   └── page.tsx                 # Main homepage
├── Components/                   # React components
│   ├── Login/                   # Authentication components
│   ├── Space/                   # Space management components
│   ├── ui/                      # Reusable UI components
│   └── *.tsx                    # Feature components
├── hooks/                       # Custom React hooks
│   ├── useHypergraphPublish.ts  # Publishing logic
│   ├── usePost.ts              # Post data management
│   ├── useCompanies.ts         # Company data management
│   └── useCompanyData.ts       # Company content data
├── app/
│   ├── schema.ts               # Hypergraph entity schemas
│   └── mapping.ts              # Data mapping utilities
└── lib/
    └── utils.ts                # Utility functions
```

## 🔧 Setup and Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- Hypergraph account and space access

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd my-hypergraph-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file with your Hypergraph configuration:

   ```env
   NEXT_PUBLIC_HYPERGRAPH_APP_ID=your_app_id
   NEXT_PUBLIC_HYPERGRAPH_SPACE_ID=your_space_id
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎯 Usage Guide

### For Users

1. **Browse Public Content**
   - Navigate to the homepage
   - Ensure "User" mode is selected
   - Explore public spaces and posts
   - View content from various companies and projects

2. **Explore Knowledge Categories**
   - Visit `/explore-public-knowledge`
   - Browse different categories:
     - **Projects**: Public project listings
     - **DApps**: Decentralized applications
     - **Assets**: Digital assets and tokens
     - **Investment Rounds**: Funding information

### For Admins

1. **Authentication**
   - Click "Admin" mode on the homepage
   - Authenticate with Hypergraph if not already logged in
   - Access private space management features

2. **Content Management**
   - View your private spaces
   - Access company paragraph management
   - Review scraped content from various sources

3. **Publishing Workflow**
   ```
   Scraped Content → Private Space → Review & Curate → Publish to Public
   ```

## 🔄 Data Flow Explained

### 1. Content Ingestion

```typescript
// Content is scraped from external sources
const company = {
  companyName: 'Example Corp',
  mediumLink: 'https://medium.com/@example-corp',
  publicSpaceId: 'public-space-uuid',
};
```

### 2. Content Processing

```typescript
// Raw content is transformed into structured format
const paragraph = {
  companyName: 'Example Corp',
  platform: 'Medium',
  postData: {
    title: 'Article Title',
    content: 'Article content...',
    author: { name: 'Author Name', username: '@author' },
    metrics: { claps: 100, views: 1000, comments: 25 },
  },
};
```

### 3. Hypergraph Publishing

```typescript
// Content is published to both private and public spaces
await publishParagraph(paragraph, privateSpaceId, publicSpaceId);
```

## 🏛️ Hypergraph Schema

### Core Entities

```typescript
// Paragraph - Main content entity
class Paragraph {
  companyName: string;
  platform: string;
  postData: Relation<PostData>;
}

// PostData - Content details
class PostData {
  postId: string;
  title: string;
  content: string;
  excerpt: string;
  author: Relation<Author>;
  url: string;
  publishedAt: string;
  tags: string;
  metrics: Relation<PostMetrics>;
  featuredImage: string;
  readingTime: number;
}

// Author - Content creator
class Author {
  name: string;
  username: string;
  profileUrl: string;
}

// PostMetrics - Engagement data
class PostMetrics {
  claps: number;
  views: number;
  comments: number;
  shares: number;
}
```

## 🔐 Authentication Flow

1. **User Authentication**
   - Click login button
   - Connect Hypergraph wallet
   - Access role-based features

2. **Space Access**
   - Private spaces: Admin-only access
   - Public spaces: Open access
   - Cross-space publishing: Authenticated users

## 📊 API Integration

### Backend Endpoints

```typescript
// Company management
GET /api/companies - List all companies
GET /api/companies/:name/paragraphs - Get company content

// Content processing
PATCH /api/companies/:name/paragraphs/:id/process - Mark as processed
```

### Hypergraph Operations

```typescript
// Entity creation
const author = await createAuthor({ name, username, profileUrl });
const postMetrics = await createPostMetrics({ claps, views, comments, shares });
const postData = await createPostData({ ...postData, author: [author.id], metrics: [postMetrics.id] });
const paragraph = await createParagraph({ companyName, platform, postData: [postData.id] });

// Publishing
const { ops } = await preparePublish({ entity: paragraph, publicSpace: publicSpaceId });
await publishOps({ ops, space: publicSpaceId, walletClient });
```

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Key Hooks

- **`useHypergraphPublish`**: Manages content publishing to Hypergraph spaces
- **`usePost`**: Handles post data fetching and management
- **`useCompanies`**: Manages company data and relationships
- **`useCompanyData`**: Handles company-specific content data

### Component Architecture

- **`PostsList`**: Displays posts in a responsive grid
- **`ParagraphCard`**: Shows paragraph content with publish functionality
- **`PostCard`**: Individual post display component
- **`SpaceList`**: Lists available spaces for management

## 🚨 Troubleshooting

### Common Issues

1. **Build Errors**
   - Ensure all dependencies are installed
   - Check TypeScript configuration
   - Verify environment variables

2. **Authentication Issues**
   - Confirm Hypergraph app configuration
   - Check wallet connection
   - Verify space permissions

3. **Publishing Failures**
   - Check space IDs are correct
   - Verify wallet has sufficient permissions
   - Ensure content meets schema requirements

### Debug Mode

Enable debug logging by adding to your environment:

```env
NEXT_PUBLIC_DEBUG=true
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- [Hypergraph Documentation](https://github.com/graphprotocol/hypergraph)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 📞 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review the troubleshooting section

---

**Built with ❤️ using Hypergraph, Next.js, and TypeScript**
