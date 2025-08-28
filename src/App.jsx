// import { useState } from "react";

// function App() {
//   const [query, setQuery] = useState("");
//   const [chat, setChat] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [suggestions, setSuggestions] = useState([]);

//   const handleSend = async () => {
//     if (!query.trim()) return;
//     setLoading(true);

//     try {
//       const res = await fetch("http://localhost:8000/api/v1/chat/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ query }),
//       });
//       console.log(res);
      

//       const data = await res.json();

//       if (data.answer) {
//         setChat(data.history || []);
//         try {
//           setSuggestions(JSON.parse(data.suggestion));
//         } catch {
//           setSuggestions([]);
//         }
//       }
//     } catch (err) {
//       console.error("Error fetching:", err);
//     } finally {
//       setQuery("");
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
//       <h1 className="text-2xl font-bold mb-4">💰 Gold Investment Assistant</h1>

//       {/* Chat Box */}
//       <div className="w-full max-w-2xl bg-white shadow-md rounded-2xl p-4 mb-4 overflow-y-auto h-[60vh]">
//         {chat.map((msg, i) => (
//           <div
//             key={i}
//             className={`my-2 p-3 rounded-xl ${
//               msg.role === "user"
//                 ? "bg-blue-100 self-end text-right"
//                 : "bg-gray-200 self-start text-left"
//             }`}
//           >
//             <p className="text-sm">{msg.content}</p>
//           </div>
//         ))}
//         {loading && <p className="text-gray-500">⏳ Thinking...</p>}
//       </div>

//       {/* Input Box */}
//       <div className="flex w-full max-w-2xl">
//         <input
//           type="text"
//           className="flex-grow border border-gray-300 rounded-l-xl px-3 py-2 focus:outline-none"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Ask about gold price, news, or trends..."
//           onKeyDown={(e) => e.key === "Enter" && handleSend()}
//         />
//         <button
//           onClick={handleSend}
//           disabled={loading}
//           className="bg-blue-500 text-white px-4 py-2 rounded-r-xl hover:bg-blue-600 disabled:opacity-50"
//         >
//           Send
//         </button>
//       </div>

//       {/* Suggested Questions */}
//       {suggestions.length > 0 && (
//         <div className="mt-4 w-full max-w-2xl">
//           <h2 className="font-semibold mb-2">🔮 Suggested Follow-ups:</h2>
//           <ul className="list-disc list-inside space-y-1">
//             {suggestions.map((q, i) => (
//               <li
//                 key={i}
//                 className="cursor-pointer text-blue-600 hover:underline"
//                 onClick={() => setQuery(q)}
//               >
//                 {q}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat"; // ✅ new chat page

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

// ✅ Floating Chat Button
function ChatButton() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/chat")}
      className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-blue-700"
    >
      💬 Chat
    </button>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/chat" element={<Chat />} /> {/* ✅ Chat page route */}
        </Routes>

        {/* ✅ Floating button available everywhere */}
        <ChatButton />
      </div>
    </BrowserRouter>
  );
}
