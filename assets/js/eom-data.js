const topics = [
  { 
    key: 'digitalekompetenz', 
    label: 'Digitale Kompetenz',
    questions: [
      'Sollte jede:r Schüler:in ein digitales Endgerät erhalten?',
      'Finden Sie digitale Grundbildung ab der Volksschule notwendig?',
      'Müssen Lehrkräfte verpflichtend im Bereich Digitalisierung geschult werden?',
      'Würden Sie an einem digitalen Weiterbildungsprogramm teilnehmen?',
      'Ist Ihnen eine bessere IT-Infrastruktur an Schulen besonders wichtig?'
    ]
  },
  { 
    key: 'egovernment', 
    label: 'E-Government',
    questions: [
      'Nutzen Sie digitale Services wie z. B. FinanzOnline regelmäßig?',
      'Ist Ihnen der digitale Zugang zu Gesundheitsdaten (z. B. ELGA, E-Rezept) wichtig?',
      'Finden Sie zentrale Verwaltungsplattformen wie oesterreich.gv.at nützlich?',
      'Möchten Sie Ihre digitale Identität online für Amtswege nutzen können?',
      'Halten Sie Online-Wahlen (e-Voting) für sinnvoll?'
    ]
  },
  { 
    key: 'ecommerce', 
    label: 'E-Commerce',
    questions: [
      'Möchten Sie als KMU konkrete Förderungen oder Beratungen für Ihren Online-Handel erhalten?',
      'Ist ein offizielles Gütesiegel für Online-Shops für Sie besonders relevant?',
      'Bevorzugen Sie regionale Online-Marktplätze gegenüber internationalen Plattformen?',
      'Suchen Sie als Gastronom:in oder Landwirt:in gezielt digitale Vermarktungslösungen?',
      'Möchten Sie niederschwellige Einstiegshilfen für den digitalen Handel nutzen?'
    ]
  },
  { 
    key: 'medienförderung', 
    label: 'Medienförderung',
    questions: [
      'Sollten kommerzielle Fernsehsender gezielt gefördert werden?',
      'Unterstützen Sie freie Radios oder unabhängige Medienprojekte?',
      'Ist Barrierefreiheit in Medienangeboten für Sie wichtig?',
      'Sollte die Medienzustellung finanziell gefördert werden?',
      'Sollte es mehr Unterstützung für digitale Transformation in Medien geben?'
    ]
  }
];

function renderAverages(topic, data) {
  let html = `<div class="averages-topic"><h2>${topic.label}</h2>`;
  
  // Wenn keine Daten vorhanden sind, zeige alle Fragen mit 0% an
  if (!data || data.length === 0) {
    topic.questions.forEach((question, index) => {
      html += `
        <div class="question-result">
          <h3>${question}</h3>
          <div class="answer-percentages">
            <div class="answer-option">
              <span class="answer-label">Ja:</span>
              <span class="answer-percentage">0.0%</span>
            </div>
            <div class="answer-option">
              <span class="answer-label">Nein:</span>
              <span class="answer-percentage">0.0%</span>
            </div>
          </div>
          <p class="no-data-note">Noch keine Antworten vorhanden</p>
        </div>
      `;
    });
  } else {
    // Verarbeite vorhandene Daten
    data.forEach((row, index) => {
      const question = topic.questions[index] || `Frage ${row.prompt}`;
      
      // Verwende die korrekten Prozentangaben aus der neuen API
      const jaPercentage = row.jaPercentage || 0;
      const neinPercentage = row.neinPercentage || 0;
      
      html += `
        <div class="question-result">
          <h3>${question}</h3>
          <div class="answer-percentages">
            <div class="answer-option">
              <span class="answer-label">Ja:</span>
              <span class="answer-percentage">${jaPercentage.toFixed(1)}%</span>
            </div>
            <div class="answer-option">
              <span class="answer-label">Nein:</span>
              <span class="answer-percentage">${neinPercentage.toFixed(1)}%</span>
            </div>
          </div>
          ${row.total > 0 ? `<p class="data-note">Basierend auf ${row.total} Antworten</p>` : ''}
        </div>
      `;
    });
    
    // Füge fehlende Fragen hinzu (falls nicht alle 5 Fragen beantwortet wurden)
    for (let i = data.length; i < 5; i++) {
      const question = topic.questions[i];
      html += `
        <div class="question-result">
          <h3>${question}</h3>
          <div class="answer-percentages">
            <div class="answer-option">
              <span class="answer-label">Ja:</span>
              <span class="answer-percentage">0.0%</span>
            </div>
            <div class="answer-option">
              <span class="answer-label">Nein:</span>
              <span class="answer-percentage">0.0%</span>
            </div>
          </div>
          <p class="no-data-note">Noch keine Antworten vorhanden</p>
        </div>
      `;
    }
  }
  
  html += '</div>';
  return html;
}

document.addEventListener('DOMContentLoaded', function() {
  const averagesDiv = document.getElementById('averages');
  averagesDiv.innerHTML = '<p>Lade Durchschnittswerte ...</p>';

  Promise.all(
    topics.map(topic =>
      fetch(`http://localhost:3000/api/statistics/${topic.key}`)
        .then(res => res.json())
        .then(data => renderAverages(topic, data))
        .catch(err => {
          console.error(`Fehler beim Laden der Daten für ${topic.key}:`, err);
          return renderAverages(topic, []); // Zeige leere Daten an
        })
    )
  ).then(htmlArr => {
    averagesDiv.innerHTML = htmlArr.join('');
  }).catch(err => {
    console.error('Fehler beim Laden der Durchschnittswerte:', err);
    averagesDiv.innerHTML = '<p>Fehler beim Laden der Daten. Bitte stelle sicher, dass der Server läuft.</p>';
  });
}); 