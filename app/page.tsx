"use client"

import { useState, useEffect } from 'react';
import groqResponse from './actions/response1';
import SyntaxHighlighter from 'react-syntax-highlighter';
import {tomorrowNightBright } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import axios from 'axios';
import Sidebar from './components/sidebar';
import { JsonToTable } from "react-json-to-table";

async function fSql(query: string) {
  try {
    const data = {
      query: query
    };
    const response = await axios.post('http://localhost:3001/api/v1/query', data)
    const res=response.data
    console.log(response);
    return res;
  } catch (e) {
    console.log(e);
  }
}

export default function App() {
  const [queryResult, setQueryResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { message: "your recent tables", timestamp: ""}
  ]);
  const [status,setStatus]=useState("");
  const [dbmsg, setDbmsg]=useState("");
  const [tableData, setTabledata]=useState();

  const onKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const inputValue = e.currentTarget.value;
      setStatus("");
      setDbmsg("")
      setLoading(true);
      const result = await groqResponse(inputValue);
      setLoading(false);
      setQueryResult(result);
      
      // Add to chat history
      setChatHistory(prev => [...prev, { message: inputValue, timestamp: new Date().toLocaleString() }]);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call on initial load

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="bg-black min-h-screen text-white flex">
      <Sidebar isOpen={isSidebarOpen} chatHistory={chatHistory} onClose={toggleSidebar} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : ''}`}>
        {!isSidebarOpen && (
          <button 
            className="md:hidden fixed top-4 left-4 z-50 p-2 rounded"
            onClick={toggleSidebar}
          >
            ☰
          </button>
        )}
        <div className="flex-1 flex flex-col justify-between p-4">
          <div className="w-full max-w-3xl mx-auto bg-black flex flex-col overflow-y-auto p-4">
            <div className="bg-black flex-1 w-full mt-10 ">
              {loading && 
                    <div className="bg-gray-900 p-4 rounded-lg w-full max-w-3xl mx-auto">
                    <div className="animate-pulse flex space-x-4">
                      <div className="flex-1 space-y-4 py-1">
                        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-700 rounded"></div>
                          <div className="h-10 bg-gray-700 rounded"></div>
                          <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                }
              <div className={`${(!loading && queryResult) ? 'border border-gray-700 bg-gray-900 hover:border-white' : ''} p-5 rounded-md`}>
                <div>
                  {!loading && queryResult && (
                    <SyntaxHighlighter language="js" style={tomorrowNightBright} className="rounded-md">
                      {queryResult}
                    </SyntaxHighlighter>
                  )}
                </div>
                <div className='flex justify-start'>
                  {!loading && queryResult && (
                    <button 
                      className='px-5 py-2 bg-white mt-4 hover:bg-gray-200 text-black font-medium transition-colors rounded-md' 
                      onClick={async () => {
                        const rs:any=await fSql(queryResult)
                        setStatus(rs.status)
                        setDbmsg(rs.message)
                        setTabledata(rs.data)
                      }}
                    >
                      Run
                    </button>
                  )}
                </div>
              </div>
                {!loading && queryResult && (status!="")&&
                  <div className={`${(status === "success") ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'}  p-2 font-medium h-10 mt-4 rounded-md border border-gray-700`}>
                    {dbmsg}
                  </div>
                }
                {!loading && queryResult && (status=="success")&&
                  <div className="rounded-md border border-gray-700 p-5 my-5 bg-gray-900">
                  <div className='mb-4'>output : </div>
                  <style jsx global>{`
                    .json-to-table table {
                      width: 100%;
                      border-collapse: collapse;
                      font-family: sans-serif;
                      font-size: 0.9rem;
                      color: white;
                      background-color: black;
                    }
                    .json-to-table td {
                      padding: 8px;
                      border: 1px solid #4B5563; /* Tailwind gray-600 */
                    }
                    .json-to-table td {
                      text-align: left;
                    }
                    .json-to-table tr:nth-child(even) {
                      background-color: black; /* Tailwind gray-800 */
                    }
                  `}</style>
                  <div className="overflow-x-auto">
                    <JsonToTable json={(tableData)}/>
                  </div>
                </div>
              }
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
            </div>
          </div>
          <div className="fixed bottom-0 left-0 right-0 md:left-64 w-full max-w-3xl mx-auto bg-black p-4">
            <input
              className="bg-gray-900 mb-4 border border-gray-700 focus:outline-none h-12 focus:border focus:border-white text-lg p-3 w-full rounded-md hover:border-white"
              onKeyDown={onKeyDown}
              placeholder="Type your query here..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}