import React, { useState, useEffect, useCallback } from 'react';
import { BookOpen, Languages, RefreshCw } from 'lucide-react';

// --- CSS Styles ---
const Styles = () => (
  <style>{`
    :root {
      --primary-blue: #2563eb;
      --primary-orange: #f97316;
      --primary-teal: #14b8a6;
      --light-gray: #f3f4f6;
      --medium-gray: #6b7280;
      --dark-gray: #1f2937;
      --white: #ffffff;
      --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      --border-radius: 0.75rem;
    }

    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background-color: var(--light-gray);
    }

    .app-container {
      min-height: 100vh;
    }

    .main-content {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }
    
    /* Header */
    .header {
      background-color: var(--white);
      box-shadow: var(--shadow);
      position: sticky;
      top: 0;
      z-index: 10;
    }
    .header-content {
      max-width: 800px;
      margin: 0 auto;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header-title {
      font-size: 1.875rem;
      font-weight: bold;
      color: var(--dark-gray);
    }
    .nav-button {
      display: flex;
      align-items: center;
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
      transition: background-color 0.2s;
      border: none;
      cursor: pointer;
      background-color: transparent;
      color: var(--medium-gray);
    }
    .nav-button:hover {
      background-color: #e5e7eb;
    }
    .nav-button.active {
      background-color: var(--primary-blue);
      color: var(--white);
    }
    .nav-button.active.orange {
        background-color: var(--primary-orange);
    }
    .nav-button svg {
      margin-right: 0.5rem;
    }

    /* Content Card */
    .content-card {
      background-color: var(--white);
      border-radius: var(--border-radius);
      box-shadow: var(--shadow);
      overflow: hidden;
    }
    .card-body {
      padding: 2rem;
    }
    .card-title {
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--medium-gray);
      margin: 0 0 1.5rem 0;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #e5e7eb;
    }
    .card-button-container {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 1rem;
    }
    .card-button {
      display: flex;
      align-items: center;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 0.5rem;
      color: var(--white);
      cursor: pointer;
      transition: background-color 0.2s;
      font-weight: 500;
    }
    .card-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    .card-button.blue { background-color: var(--primary-blue); }
    .card-button.blue:hover:not(:disabled) { background-color: #1d4ed8; }
    .card-button.orange { background-color: var(--primary-orange); }
    .card-button.orange:hover:not(:disabled) { background-color: #ea580c; }
    .card-button svg {
      margin-right: 0.5rem;
    }
    .loading-spinner {
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* Vocabulary Specific */
    .item-title {
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
      text-transform: capitalize;
    }
    .item-title.blue { color: var(--primary-blue); }
    .phonetic {
      font-size: 1.125rem;
      color: var(--medium-gray);
      margin-bottom: 1rem;
    }
    .meaning-block {
      margin-bottom: 1rem;
    }
    .part-of-speech {
      font-weight: 600;
      font-size: 1.25rem;
      color: var(--dark-gray);
      text-transform: capitalize;
    }
    .definition-block {
      margin-top: 0.5rem;
      padding-left: 1rem;
      border-left: 4px solid #93c5fd;
    }
    .definition-text { color: #374151; }
    .example-text {
      font-size: 0.875rem;
      color: var(--medium-gray);
      margin-top: 0.25rem;
      font-style: italic;
    }
    .loading-text, .error-text {
        text-align: center;
        padding: 1rem;
        color: var(--medium-gray);
    }
    .error-text {
        color: #ef4444;
        background-color: #fee2e2;
        border-radius: 0.5rem;
    }
    
    /* Multi-language Vocab Specific */
    .translation-display {
        text-align: center;
    }
    .main-hindi-word {
        font-size: 3rem;
        font-weight: bold;
        color: var(--primary-orange);
        margin-bottom: 1rem;
    }
    .meaning-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }
    .meaning-card {
        padding: 1rem;
        border-radius: 0.5rem;
    }
    .meaning-card.english {
        background-color: #eff6ff;
        border: 1px solid #dbeafe;
    }
    .meaning-card.telugu {
        background-color: #f0fdfa;
        border: 1px solid #ccfbf1;
    }
    .meaning-label {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--medium-gray);
        margin-bottom: 0.25rem;
    }
    .meaning-text {
        font-size: 1.25rem;
        font-weight: 500;
        text-transform: capitalize;
    }
    .meaning-text.english-text { color: var(--primary-blue); }
    .meaning-text.telugu-text { color: var(--primary-teal); }
    
    .example-card {
        background-color: #fafafa;
        border: 1px solid #e5e5e5;
        border-radius: 0.5rem;
        padding: 1rem;
        text-align: left;
    }
    .example-label {
        font-weight: bold;
        color: var(--dark-gray);
    }
    .example-sentence {
        margin-top: 0.5rem;
        color: var(--medium-gray);
        font-style: italic;
    }

    /* Footer */
    .footer {
      background-color: var(--white);
      margin-top: 2rem;
      padding: 1rem;
      text-align: center;
      font-size: 0.875rem;
      color: var(--medium-gray);
    }
    
    @media (max-width: 640px) {
        .main-content { padding: 1rem; }
        .header-content { padding: 1rem; }
        .header-title { font-size: 1.5rem; }
        .nav-button span { display: none; }
        .nav-button svg { margin-right: 0; }
        .card-body { padding: 1.5rem; }
        .item-title { font-size: 1.75rem; }
        .meaning-grid { grid-template-columns: 1fr; }
    }
  `}</style>
);


// --- Components ---

const App = () => {
  const [activeTab, setActiveTab] = useState('hindiVocabulary');

  const renderContent = () => {
    switch (activeTab) {
      case 'englishVocabulary':
        return <EnglishVocabulary />;
      case 'hindiVocabulary':
        return <HindiVocabulary />;
      default:
        return <HindiVocabulary />;
    }
  };

  return (
    <div className="app-container">
      <Styles />
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

const Header = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'hindiVocabulary', label: 'Hindi', icon: <Languages size={20} />, color: 'orange' },
    { id: 'englishVocabulary', label: 'English', icon: <BookOpen size={20} />, color: 'blue' },
  ];

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">Vocab Hub</h1>
        <nav>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-button ${activeTab === item.id ? 'active ' + item.color : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

const HindiVocabulary = () => {
  const [wordData, setWordData] = useState({ hindi: '', english: '', telugu: '', example: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNewWordData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    for (let i = 0; i < 5; i++) { // Increased retry limit for this complex fetch
        try {
            const randomWordResponse = await fetch('https://random-word-api.herokuapp.com/word?number=1');
            if (!randomWordResponse.ok) continue;
            const randomWord = await randomWordResponse.json();
            const englishWord = randomWord[0];

            const [dictResponse, hindiResponse, teluguResponse] = await Promise.all([
                fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${englishWord}`),
                fetch(`https://api.mymemory.translated.net/get?q=${englishWord}&langpair=en|hi`),
                fetch(`https://api.mymemory.translated.net/get?q=${englishWord}&langpair=en|te`)
            ]);

            if (!dictResponse.ok || !hindiResponse.ok || !teluguResponse.ok) continue;

            const dictData = await dictResponse.json();
            const hindiData = await hindiResponse.json();
            const teluguData = await teluguResponse.json();
            
            const hindiText = hindiData.responseData?.translatedText;
            const teluguText = teluguData.responseData?.translatedText;

            let exampleSentence = '';
            if (dictData[0]?.meanings) {
                for (const meaning of dictData[0].meanings) {
                    if (meaning.definitions[0]?.example) {
                        exampleSentence = meaning.definitions[0].example;
                        break;
                    }
                }
            }
            
            if (hindiText && teluguText && hindiText.toLowerCase() !== englishWord.toLowerCase()) {
                setWordData({
                    hindi: hindiText,
                    english: englishWord,
                    telugu: teluguText,
                    example: exampleSentence || 'No example sentence found.'
                });
                setLoading(false);
                return;
            }
        } catch (err) {
            console.error(err);
        }
    }

    setError('Could not get a new word. Please try again.');
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchNewWordData();
  }, [fetchNewWordData]);

  return (
    <ContentCard title="Hindi Word of the Day">
        <div className="card-button-container">
            <button onClick={fetchNewWordData} disabled={loading} className="card-button orange">
                <RefreshCw size={16} className={loading ? 'loading-spinner' : ''} />
                New Word
            </button>
        </div>
        {loading && <div className="loading-text">Finding a new word...</div>}
        {error && <div className="error-text">{error}</div>}
        {!loading && !error && wordData.hindi && (
            <div className="translation-display">
                <h3 className="main-hindi-word">{wordData.hindi}</h3>
                <div className="meaning-grid">
                    <div className="meaning-card english">
                        <p className="meaning-label">English Meaning</p>
                        <p className="meaning-text english-text">{wordData.english}</p>
                    </div>
                    <div className="meaning-card telugu">
                        <p className="meaning-label">Telugu Meaning</p>
                        <p className="meaning-text telugu-text">{wordData.telugu}</p>
                    </div>
                </div>
                <div className="example-card">
                    <p className="example-label">Usage Example:</p>
                    <p className="example-sentence">"{wordData.example}"</p>
                </div>
            </div>
        )}
    </ContentCard>
  );
};

const EnglishVocabulary = () => {
    const [wordData, setWordData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchNewWord = useCallback(async () => {
        setLoading(true);
        setError(null);
        for (let i = 0; i < 3; i++) {
            try {
                const randomWordResponse = await fetch('https://random-word-api.herokuapp.com/word?number=1');
                if (!randomWordResponse.ok) continue;
                const randomWord = await randomWordResponse.json();
                
                const dictionaryResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${randomWord[0]}`);
                if (dictionaryResponse.ok) {
                    const data = await dictionaryResponse.json();
                    setWordData(data[0]);
                    setLoading(false);
                    return;
                }
            } catch (err) {
                console.error("Fetch error:", err);
            }
        }
        setError('Could not load a new word. Please try again.');
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchNewWord();
    }, [fetchNewWord]);

    return (
        <ContentCard title="English Word of the Day">
            <div className="card-button-container">
                 <button onClick={fetchNewWord} disabled={loading} className="card-button blue">
                    <RefreshCw size={16} className={loading ? 'loading-spinner' : ''} />
                    New Word
                </button>
            </div>
            {loading && <div className="loading-text">Finding a new word...</div>}
            {error && <div className="error-text">{error}</div>}
            {wordData && (
                <div>
                    <h3 className="item-title blue">{wordData.word}</h3>
                    <p className="phonetic">{wordData.phonetic}</p>
                    {wordData.meanings.map((meaning, index) => (
                        <div key={index} className="meaning-block">
                            <h4 className="part-of-speech">{meaning.partOfSpeech}</h4>
                            {meaning.definitions.map((def, i) => (
                                <div key={i} className="definition-block">
                                    <p className="definition-text">{def.definition}</p>
                                    {def.example && <p className="example-text">e.g., "{def.example}"</p>}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </ContentCard>
    );
};

const ContentCard = ({ title, children }) => {
  return (
    <div className="content-card">
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        {children}
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Vocab Hub. Happy Learning!</p>
    </footer>
  );
};

export default App;
