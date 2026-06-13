const fs = require('fs');
const file = 'c:/Users/JAINS/OneDrive/Desktop/Hindu-Encyclopedia/frontend/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("const [searchQuery, setSearchQuery] = useState('')", "const [searchQuery, setSearchQuery] = useState('')\n  const [showYugaChronicles, setShowYugaChronicles] = useState(false)");
content = content.replace('<button id="themeToggleBtn"', '<button className="top-btn" onClick={() => setShowYugaChronicles(!showYugaChronicles)} style={{ marginRight: "10px" }}>{showYugaChronicles ? "Return to Lore" : "Yuga Chronicles"}</button>\n        <button id="themeToggleBtn"');
content = content.replace('<h1 id="mainTitle">', '{!showYugaChronicles ? (\n        <>\n          <h1 id="mainTitle">');
content = content.replace('onRestartQuiz={restartQuiz}\n        />\n      <footer>', 'onRestartQuiz={restartQuiz}\n        />\n        </>\n      ) : (\n        <YugaChronicles />\n      )}\n      <footer>');

fs.writeFileSync(file, content);
