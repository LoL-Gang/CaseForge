import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import FormScreen from './screens/FormScreen'
import ArchiveScreen from './screens/ArchiveScreen'

const sampleChatTiles = [
  {
    name: "General AI Assistant",
    description: "A versatile AI capable of answering questions on a wide range of topics, from history and science to current events and pop culture."
  },
  {
    name: "Code Companion",
    description: "An AI specializing in programming assistance, helping with code reviews, debugging, and explaining complex algorithms."
  },
  {
    name: "Creative Writing Muse",
    description: "An AI designed to inspire writers, offering plot ideas, character development tips, and creative writing prompts."
  },
  {
    name: "Math Tutor",
    description: "A patient AI tutor that can explain mathematical concepts from basic arithmetic to advanced calculus, providing step-by-step solutions."
  },
  {
    name: "Language Learner's Friend",
    description: "An AI polyglot that assists in learning new languages, offering translations, pronunciation guides, and cultural insights."
  },
  {
    name: "Fitness Coach",
    description: "An AI personal trainer that provides workout routines, nutrition advice, and motivation to help users achieve their fitness goals."
  },
  {
    name: "Culinary Advisor",
    description: "A knowledgeable AI chef that shares recipes, cooking techniques, and food pairing suggestions for aspiring home cooks."
  },
  {
    name: "Travel Planner",
    description: "An AI travel expert that helps users plan trips, suggesting destinations, itineraries, and travel tips based on preferences and budget."
  },
  {
    name: "Financial Wizard",
    description: "An AI financial advisor offering guidance on budgeting, investing, and long-term financial planning for individuals and small businesses."
  },
  {
    name: "Green Living Guide",
    description: "An eco-friendly AI that provides tips on sustainable living, from reducing carbon footprint to adopting environmentally conscious habits."
  },
  {
    name: "Movie Buff",
    description: "A cinema-savvy AI that offers movie recommendations, trivia, and analyses of films across various genres and eras."
  },
  {
    name: "Music Maestro",
    description: "An AI with extensive knowledge of music theory, history, and current trends, helping users explore new genres and artists."
  },
  {
    name: "Pet Care Companion",
    description: "A helpful AI for pet owners, offering advice on pet care, health, training, and behavior for various types of animals."
  },
  {
    name: "DIY Project Assistant",
    description: "An AI handyman that guides users through home improvement and craft projects, providing step-by-step instructions and safety tips."
  },
  {
    name: "Mindfulness Coach",
    description: "An AI focused on mental health and wellbeing, offering meditation guidance, stress-reduction techniques, and positive affirmations."
  }
];

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className='h-screen w-screen'>
    <ArchiveScreen items={sampleChatTiles} /> 
    <FormScreen/>
    </div>
     
    </>
  )
}

export default App
