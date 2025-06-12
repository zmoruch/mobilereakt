"use client";

import React, { useState, useEffect } from 'react';
import { Home, MessageCircle, Notebook, Mic, MoreHorizontal, Send, X, Plus, Trash2 } from 'lucide-react';

interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  time: string;
}

interface NoteItem {
  id: number;
  title: string;
  content: string;
  completed: boolean;
}

const MobileApp = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showChat, setShowChat] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 1, text: 'Witaj! Jak mogę Ci pomóc?', sender: 'bot', time: '10:30' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [noteItems, setNoteItems] = useState<NoteItem[]>([
    { id: 1, title: 'Zakupy', content: 'Mleko, chleb, masło', completed: false },
    { id: 2, title: 'Zadania na dziś', content: 'Spotkanie o 14:00, e-mail do klienta', completed: false },
    { id: 3, title: 'Pomysły na projekt', content: 'Nowy design, optymalizacja UI', completed: true }
  ]);

  // Symulacja API
  const sendToAPI = async (data: ChatMessage) => {
    // Symulacja REST API call
    console.log('Sending to API:', data);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true, message: 'Data sent successfully' });
      }, 1000);
    });
  };

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now(),
        text: newMessage,
        sender: 'user',
        time: new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })
      };
      
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Symulacja wysyłania do API
      await sendToAPI(message);
      
      // Symulacja odpowiedzi bota
      setTimeout(() => {
        const botResponse: ChatMessage = {
          id: Date.now() + 1,
          text: 'Dziękuję za wiadomość! Przetwarzam Twoje żądanie...',
          sender: 'bot',
          time: new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages(prev => [...prev, botResponse]);
      }, 1500);
    }
  };

  const addNewNote = () => {
    const newNote = {
      id: Date.now(),
      title: 'Nowa notatka',
      content: 'Kliknij aby edytować...',
      completed: false
    };
    setNoteItems(prev => [...prev, newNote]);
  };

  const toggleNoteComplete = (id: number) => {
    setNoteItems(prev => 
      prev.map(note => 
        note.id === id ? { ...note, completed: !note.completed } : note
      )
    );
  };

  const deleteNote = (id: number) => {
    setNoteItems(prev => prev.filter(note => note.id !== id));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="p-6 space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Witaj w aplikacji!</h1>
              <p className="text-gray-600">Twoja progresywna aplikacja mobilna</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                <MessageCircle className="w-8 h-8 mb-2" />
                <h3 className="font-semibold">Chat</h3>
                <p className="text-sm opacity-90">Wiadomości: {chatMessages.length}</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
                <Notebook className="w-8 h-8 mb-2" />
                <h3 className="font-semibold">Notatki</h3>
                <p className="text-sm opacity-90">Pozycji: {noteItems.length}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-3">Ostatnia aktywność</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Nowa wiadomość otrzymana</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Notatka została zaktualizowana</span>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'notes':
        return (
          <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Notatki</h2>
              <button
                onClick={addNewNote}
                className="bg-blue-500 text-white rounded-full p-2 shadow-lg hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              {noteItems.map(note => (
                <div
                  key={note.id}
                  className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${
                    note.completed ? 'border-green-500 bg-green-50' : 'border-blue-500'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className={`font-semibold ${note.completed ? 'text-green-700 line-through' : 'text-gray-800'}`}>
                        {note.title}
                      </h3>
                      <p className={`text-sm mt-1 ${note.completed ? 'text-green-600' : 'text-gray-600'}`}>
                        {note.content}
                      </p>
                    </div>
                    <div className="flex space-x-2 ml-3">
                      <button
                        onClick={() => toggleNoteComplete(note.id)}
                        className={`p-1 rounded ${
                          note.completed 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="p-1 rounded bg-red-500 text-white hover:bg-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'mic':
        return (
          <div className="p-6 text-center space-y-6">
            <div className="mx-auto w-32 h-32 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
              <Mic className="w-16 h-16 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Nagrywanie</h2>
              <p className="text-gray-600">Dotknij mikrofonu aby rozpocząć nagrywanie</p>
            </div>
            <button className="bg-red-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-600 transition-colors">
              Rozpocznij nagrywanie
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen relative overflow-hidden">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800">MojaApp</h1>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Online</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-20 min-h-screen">
        {renderContent()}
      </div>

      {/* Chat Overlay */}
      {showChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowChat(false)}>
          <div 
            className="absolute bottom-20 left-0 right-0 bg-white rounded-t-xl shadow-xl max-h-96 flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">Chat</h3>
              <button
                onClick={() => setShowChat(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Napisz wiadomość..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Menu Overlay */}
      {showMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowMenu(false)}>
          <div className="absolute bottom-20 right-4 bg-white rounded-lg shadow-xl py-2 min-w-48">
            <button className="w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-700">
              Ustawienia
            </button>
            <button className="w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-700">
              Profil
            </button>
            <button className="w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-700">
              Pomoc
            </button>
            <div className="border-t border-gray-200 mt-2 pt-2">
              <button className="w-full text-left px-4 py-3 hover:bg-gray-50 text-red-600">
                Wyloguj
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-30">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              activeTab === 'home' ? 'text-blue-500 bg-blue-50' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">Główna</span>
          </button>

          <button
            onClick={() => {
              setShowChat(!showChat);
              setShowMenu(false);
            }}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              showChat ? 'text-blue-500 bg-blue-50' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <MessageCircle className="w-6 h-6" />
            <span className="text-xs mt-1">Chat</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              activeTab === 'notes' ? 'text-blue-500 bg-blue-50' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Notebook className="w-6 h-6" />
            <span className="text-xs mt-1">Notatki</span>
          </button>

          <button
            onClick={() => setActiveTab('mic')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              activeTab === 'mic' ? 'text-blue-500 bg-blue-50' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Mic className="w-6 h-6" />
            <span className="text-xs mt-1">Mikrofon</span>
          </button>

          <button
            onClick={() => {
              setShowMenu(!showMenu);
              setShowChat(false);
            }}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              showMenu ? 'text-blue-500 bg-blue-50' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <MoreHorizontal className="w-6 h-6" />
            <span className="text-xs mt-1">Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileApp;