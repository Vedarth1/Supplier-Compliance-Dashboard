import React from 'react';
import index from './assets/index.png';
import { Link } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-red-400 to-indigo-900">
      <nav className="flex justify-between items-center p-6">
        <div className="flex items-center space-x-2">
          <span className="text-white text-2xl font-bold">InsightSphere</span>
        </div>
        <div className="flex space-x-4">
          <Link to='/signup' className="text-white hover:underline">Signup</Link>
          <Link to='/login' className="text-white hover:underline">Login</Link>
        </div>
      </nav>

      <main className="flex flex-col md:flex-row items-center justify-between mt-36 px-4 md:px-10 max-w-6xl mx-auto">
        <div className="w-full h-150 rounded-lg shadow-lg mx-auto">
          <img 
            src={index} 
            alt="InsightSphere Dashboard Preview" 
            className="w-full h-150 rounded-lg shadow-lg mx-auto" 
          />
        </div>

        <div className="w-full md:w-1/2 text-center md:text-left ml-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Welcome to InsightSphere!</h1>
          <p className="text-lg text-white mb-8">
          💰 Your all-in-one solution for Supplier Compliance Monitoring and Insights.
          <br />
          <br />
          💰 Track compliance, analyze patterns, and enhance supplier relationships!
          </p>
          <Link to='/dashboard' className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded">
            Get Started
          </Link>
        </div>
      </main>
    </div>
  );
}

export default App;
