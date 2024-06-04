"use client"
import Image from 'next/image';
import { useEffect, useState } from 'react';
const Home = () => {

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [inputData, setInputData] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const query = async (data:any) => {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
      {
        headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY}` },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const result = await response.blob();
    const output = URL.createObjectURL(result);
    return output
  }

  const handleGenerateImage = async () => {
    try {
      setLoading(true);
      const data = await query({ "inputs": inputData }); // Pass the user input to the API
      setImageSrc(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-800 via-purple-700 to-pink-600 text-white">
      <div className="max-w-2xl w-full bg-white p-8 rounded shadow-md">
        <h1 className="text-3xl font-bold mb-4 text-gray-800 text-center">AI-Image Generator</h1>
        <input
          type="text"
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
          placeholder="Enter input"
          className="border border-gray-300 p-2 mb-4 w-full text-black"
        />
        <div className='flex justify-center items-center'>
        <button
          onClick={handleGenerateImage}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
        >
          Generate Image
        </button>
        </div>
        
        {loading && (
          <div className="mt-4 flex items-center justify-center">
            <div className="animate-spin rounded-full border-t-4 border-blue-50 border-b-4 border-gray-400 h-8 w-8"></div>
            <p className="ml-2 text-gray-800">Loading...</p>
          </div>
        )}
        {imageSrc && (
          <div className="mt-4">
            <img
              src={imageSrc}
              alt="Result from API"
              className="max-w-full h-auto rounded"
            />
          </div>
        )}
      </div>
    </div>
);
};

export default Home;