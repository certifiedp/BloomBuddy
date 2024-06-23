# BloomBuddy

BloomBuddy is an interactive plant monitoring system that brings your plants to life through AI-powered conversations and real-time sensor data visualization.

# Demo Vercel Deployment

https://bloom-buddy.vercel.app/

## Features

- Real-time plant sensor data monitoring (light, soil pH, and soil moisture)
- AI-powered conversational interface with your plant
- Automatic image analysis for plant health assessment
- Responsive dashboard with visual representations of plant health
- Dark/Light mode toggle

## Technologies Used

- Next.js 13
- React
- TypeScript
- Tailwind CSS
- Supabase
- OpenAI API
- Hume AI Voice API
- Shadcn UI

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_HUME_API_KEY=your_hume_api_key
   NEXT_PUBLIC_HUME_SECRET_KEY=your_hume_secret_key
   OPENAI_API_KEY=your_openai_api_key
   ```
4. Set up Supabase schema:
   - Log in to your Supabase project
   - Navigate to the SQL Editor
   - Create a new query and paste the contents of `plant-table.sql`
   - Run the query to create the `plant` table in your Supabase database
5. Run the development server:
   ```
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `app/`: Contains the main application pages and API routes
- `components/`: Reusable React components
- `lib/`: Utility functions and shared logic
- `styles/`: Global styles and Tailwind CSS configuration
- `public/`: Static assets

## Key Components

- Dashboard (`app/dashboard/page.tsx`): Main interface for plant monitoring and interaction
- AudioVisualizer (`components/AudioVisualizer.tsx`): Visualizes audio input and output
- Controls (`components/Controls.tsx`): Manages voice chat controls
- ClientComponent (`components/clientComponent.tsx`): Wraps the Hume AI Voice Provider

## API Routes

- `/api/upload-plant-image`: Handles image upload and analysis for plant health assessment
