const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const rootDir = path.join(__dirname, '..', '..'); // project root
const db = new sqlite3.Database(path.join(rootDir, 'ratings.db'));

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the project root
app.use(express.static(rootDir));

// Create ratings table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS ratings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic TEXT,
  prompt INTEGER,
  rating INTEGER
)`);

// Save rating
app.post('/api/rate', (req, res) => {
  const { topic, selections } = req.body;
  if (!topic || !Array.isArray(selections) || selections.length !== 5) {
    return res.status(400).json({ error: 'Invalid data' });
  }
  const stmt = db.prepare('INSERT INTO ratings (topic, prompt, rating) VALUES (?, ?, ?)');
  selections.forEach((selection, idx) => {
    stmt.run(topic, idx + 1, selection);
  });
  stmt.finalize();
  res.json({ success: true });
});

// Get averages
app.get('/api/averages/:topic', (req, res) => {
  const topic = req.params.topic;
  db.all(
    'SELECT prompt, AVG(rating) as avg FROM ratings WHERE topic = ? GROUP BY prompt ORDER BY prompt',
    [topic],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// Get detailed statistics with actual counts
app.get('/api/statistics/:topic', (req, res) => {
  const topic = req.params.topic;
  db.all(
    `SELECT 
      prompt, 
      rating,
      COUNT(*) as count
     FROM ratings 
     WHERE topic = ? 
     GROUP BY prompt, rating 
     ORDER BY prompt, rating`,
    [topic],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      
      // Organize data by prompt
      const stats = {};
      rows.forEach(row => {
        if (!stats[row.prompt]) {
          stats[row.prompt] = { ja: 0, nein: 0, total: 0 };
        }
        if (row.rating === 1) {
          stats[row.prompt].ja = row.count;
        } else if (row.rating === 2) {
          stats[row.prompt].nein = row.count;
        }
        stats[row.prompt].total += row.count;
      });
      
      // Calculate percentages
      const result = Object.keys(stats).map(prompt => ({
        prompt: parseInt(prompt),
        ja: stats[prompt].ja,
        nein: stats[prompt].nein,
        total: stats[prompt].total,
        jaPercentage: stats[prompt].total > 0 ? (stats[prompt].ja / stats[prompt].total) * 100 : 0,
        neinPercentage: stats[prompt].total > 0 ? (stats[prompt].nein / stats[prompt].total) * 100 : 0
      }));
      
      res.json(result);
    }
  );
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
  console.log('Statische Dateien werden aus dem Projekt-Hauptverzeichnis bereitgestellt.');
});