document.addEventListener('DOMContentLoaded', function() {
  initializeEOM();
});

function initializeEOM() {
  setupYesNoQuiz();
  setupScrolly();
}

function setupYesNoQuiz() {
  const promptBlocks = Array.from(document.querySelectorAll('.prompt-block'));
  const yesNoButtons = document.querySelectorAll('.option-btn');
  let answers = [];

  yesNoButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const block = this.closest('.prompt-block');
      const idx = promptBlocks.indexOf(block);
      const answerValue = this.getAttribute('data-value');
      
      // Save answer
      answers[idx - 1] = answerValue;
      
      // Highlight selection
      block.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
      this.classList.add('selected');
      // Hide current, show next
      block.style.display = 'none';
      if (promptBlocks[idx + 1] && promptBlocks[idx + 1].id.startsWith('prompt')) {
        promptBlocks[idx + 1].style.display = '';
        promptBlocks[idx + 1].scrollIntoView({behavior: "smooth", block: "center"});
      } else {
        // Show result
        showResult(answers);
      }
    });
  });
}

function showResult(answers) {
  const topic = getCurrentTopic();
  console.log('=== DEBUG showResult ===');
  console.log('Detected topic:', topic);
  console.log('Answers:', answers);
  
  const resultBlock = document.getElementById('result-block');
  if (!resultBlock) return;
  let result = getResultForAnswers(topic, answers);
  console.log('Result:', result);
  
  resultBlock.innerHTML = `
    <div class="prompt-card result-card">
      <h2>Ihr Ergebnis</h2>
      <p>${result.description}</p>
      <div class="initiative-links">
        ${result.initiatives.map(i => `<a href="generic.html#${i.anchor}" class="initiative-link" target="_blank">${i.name}</a>`).join(' &amp; ')}
      </div>
      <button class="start-btn" onclick="window.location.href='eom.html'">Zur Erfolg-o-meter Daten Seite</button>
    </div>
  `;
  resultBlock.style.display = '';
  resultBlock.scrollIntoView({behavior: "smooth", block: "center"});
}

function getResultForAnswers(topic, answers) {
  // E-Commerce Empfehlungen
  if (topic === 'ecommerce') {
    if (answers[0] === 'ja' && answers[4] === 'ja') {
      return {
        description: 'Du legst Wert auf regionale Produkte und digitale Förderungen. Für dich sind lokale Marktplätze und KMU-Förderungen besonders interessant.',
        initiatives: [
          { name: 'Gmunden Marktplatz', anchor: 'ecom' },
          { name: 'KMU.Digital', anchor: 'ecom' },
          { name: 'Marktplatz Wolfsberg', anchor: 'ecom' }
        ]
      };
    } else if (answers[1] === 'ja' && answers[2] === 'ja') {
      return {
        description: 'Dir ist die Unterstützung von KMU und bequeme Lieferoptionen wichtig. Wir empfehlen KMU.Digital und das E-Commerce Gütezeichen.',
        initiatives: [
          { name: 'KMU.Digital', anchor: 'ecom' },
          { name: 'E-Commerce Gütezeichen', anchor: 'ecom' }
        ]
      };
    } else if (answers[3] === 'ja' && answers[4] === 'ja') {
      return {
        description: 'Sicherheit und digitale Förderungen sind dir wichtig. Schau dir die Investitionsprämie und das E-Commerce Gütezeichen an.',
        initiatives: [
          { name: 'Investitionsprämie', anchor: 'ecom' },
          { name: 'E-Commerce Gütezeichen', anchor: 'ecom' }
        ]
      };
    } else if (answers[0] === 'ja' && answers[3] === 'ja') {
      return {
        description: 'Du schätzt regionale Produkte und sichere Online-Shops. Der Gmunden Marktplatz und das E-Commerce Gütezeichen sind perfekt für dich.',
        initiatives: [
          { name: 'Gmunden Marktplatz', anchor: 'ecom' },
          { name: 'E-Commerce Gütezeichen', anchor: 'ecom' }
        ]
      };
    } else {
      return {
        description: 'Du hast vielfältige Interessen im E-Commerce-Bereich. Entdecke verschiedene Projekte von lokalen Marktplätzen bis zu digitalen Förderprogrammen.',
        initiatives: [
          { name: 'Alle E-Commerce-Projekte', anchor: 'ecom' }
        ]
      };
    }
  }
  
  // E-Government Empfehlungen
  if (topic === 'egovernment') {
    if (answers[0] === 'ja' && answers[3] === 'ja') {
      return {
        description: 'Digitale Steuererklärungen und sichere Gesundheitsdaten sind dir wichtig. FinanzOnline und ELGA & E-Rezept sind perfekt für dich.',
        initiatives: [
          { name: 'FinanzOnline', anchor: 'egov' },
          { name: 'ELGA & E-Rezept', anchor: 'egov' }
        ]
      };
    } else if (answers[2] === 'ja' && answers[4] === 'ja') {
      return {
        description: 'Schnelle Amtswege und sichere digitale Identität sind dir wichtig. Das Digitale Amt und ID Austria sind für dich relevant.',
        initiatives: [
          { name: 'Digitales Amt / oesterreich.gv.at', anchor: 'egov' },
          { name: 'ID Austria', anchor: 'egov' }
        ]
      };
    } else if (answers[1] === 'ja' && answers[4] === 'ja') {
      return {
        description: 'Datenschutz und digitale Gesundheitsdaten sind dir wichtig. ELGA & E-Rezept und ID Austria setzen hohe Sicherheitsstandards.',
        initiatives: [
          { name: 'ELGA & E-Rezept', anchor: 'egov' },
          { name: 'ID Austria', anchor: 'egov' }
        ]
      };
    } else if (answers[0] === 'ja' && answers[2] === 'ja') {
      return {
        description: 'Digitale Steuererklärungen und schnelle Amtswege sind dir wichtig. FinanzOnline und das Digitale Amt bieten diese Services.',
        initiatives: [
          { name: 'FinanzOnline', anchor: 'egov' },
          { name: 'Digitales Amt / oesterreich.gv.at', anchor: 'egov' }
        ]
      };
    } else {
      return {
        description: 'Du interessierst dich für digitale Verwaltung. Entdecke weitere E-Government-Projekte wie e-Voting und andere digitale Dienste.',
        initiatives: [
          { name: 'Alle E-Government-Projekte', anchor: 'egov' }
        ]
      };
    }
  }
  
  // Medienförderung Empfehlungen
  if (topic === 'medienförderung') {
    // Based on the provided answer combinations, most combinations should show Fernsehfonds Austria and Privatrundfonds
    // Only specific combinations should show Nichtkommerzieller Rundfunkfonds and Zustellförderung
    
    // Check if we have at least 2 "ja" answers in the first 4 questions
    const jaCount = answers.slice(0, 4).filter(answer => answer === 'ja').length;
    
    if (jaCount >= 2) {
      return {
        description: 'Unabhängige Medien und transparente Förderung sind dir wichtig. Der Fernsehfonds Austria und Privatrundfunkfonds fördern genau das.',
        initiatives: [
          { name: 'Fernsehfonds Austria', anchor: 'medien' },
          { name: 'Privatrundfunkfonds', anchor: 'medien' }
        ]
      };
    } else {
      // Default case for combinations with fewer "ja" answers
      return {
        description: 'Du interessierst dich für Medienförderung. Entdecke weitere Projekte wie die Barrierefreiheitsförderung und andere Medieninitiativen.',
        initiatives: [
          { name: 'Nichtkommerzieller Rundfunkfonds', anchor: 'medien' },
          { name: 'Zustellförderung', anchor: 'medien' }
        ]
      };
    }
  }
  
  // Digitale Kompetenz Empfehlungen
  if (topic === 'digitalekompetenz') {
    if (answers[0] === 'ja' && answers[2] === 'ja' && answers[4] === 'ja') {
      return {
        description: 'Digitale Grundbildung, Lernmaterialien und Endgeräte sind dir wichtig. School 4.0 und die digitale Endgeräte-Initiative sind perfekt für dich.',
        initiatives: [
          { name: 'School 4.0', anchor: 'kompetenz' },
          { name: 'Digitale Endgeräte für Schülerinnen und Schüler', anchor: 'kompetenz' }
        ]
      };
    } else if (answers[1] === 'ja' && answers[2] === 'ja') {
      return {
        description: 'Lehrkräfte-Fortbildung und digitale Lernmaterialien sind dir wichtig. Der Distance-Learning-MOOC und die Eduthek unterstützen genau das.',
        initiatives: [
          { name: 'Distance-Learning-MOOC', anchor: 'kompetenz' },
          { name: 'Eduthek', anchor: 'kompetenz' }
        ]
      };
    } else if (answers[0] === 'ja' && answers[4] === 'ja') {
      return {
        description: 'Digitale Grundbildung und Erwachsenenbildung sind dir wichtig. Der 8-Punkte-Plan und die Digitalkompetenzoffensive fördern genau das.',
        initiatives: [
          { name: '8-Punkte-Plan für eine Digitale Schule', anchor: 'kompetenz' },
          { name: 'Digitalkompetenzoffensive', anchor: 'kompetenz' }
        ]
      };
    } else if (answers[2] === 'ja' && answers[4] === 'ja') {
      return {
        description: 'Digitale Lernmaterialien und Endgeräte sind dir wichtig. Die Eduthek und digitale Endgeräte-Initiative sind relevant.',
        initiatives: [
          { name: 'Eduthek', anchor: 'kompetenz' },
          { name: 'Digitale Endgeräte für Schülerinnen und Schüler', anchor: 'kompetenz' }
        ]
      };
    } else {
      return {
        description: 'Du interessierst dich für digitale Bildung. Entdecke weitere Initiativen wie eFit21 und andere Bildungsprojekte.',
        initiatives: [
          { name: 'eFit21 – Digitale Agenda', anchor: 'kompetenz' },
          { name: 'Alle Digital-Kompetenz-Projekte', anchor: 'kompetenz' }
        ]
      };
    }
  }
  
  // Default fallback
  return {
    description: 'Entdecke passende Projekte auf unserer Informationsseite.',
    initiatives: [
      { name: 'Zur Übersicht', anchor: '' }
    ]
  };
}

function getCurrentTopic() {
  // First check if the topic is set globally (most reliable)
  if (window.currentTopic) {
    console.log('Detected topic from global variable:', window.currentTopic);
    return window.currentTopic;
  }
  
  const path = window.location.pathname;
  const href = window.location.href;
  const filename = path.split('/').pop(); // Get the filename from the path
  
  console.log('=== DEBUG getCurrentTopic ===');
  console.log('Path:', path);
  console.log('Href:', href);
  console.log('Filename:', filename);
  console.log('Document title:', document.title);
  
  // Check filename first (most reliable)
  if (filename === 'digitalekompetenz.html') {
    console.log('Detected: digitalekompetenz (from filename)');
    return 'digitalekompetenz';
  }
  if (filename === 'egovernment.html') {
    console.log('Detected: egovernment (from filename)');
    return 'egovernment';
  }
  if (filename === 'ecommerce.html') {
    console.log('Detected: ecommerce (from filename)');
    return 'ecommerce';
  }
  if (filename === 'medienförderung.html') {
    console.log('Detected: medienförderung (from filename)');
    return 'medienförderung';
  }
  
  // Fallback to path/href checking
  if (path.includes('digitalekompetenz') || href.includes('digitalekompetenz')) {
    console.log('Detected: digitalekompetenz (from path/href)');
    return 'digitalekompetenz';
  }
  if (path.includes('egovernment') || href.includes('egovernment')) {
    console.log('Detected: egovernment (from path/href)');
    return 'egovernment';
  }
  if (path.includes('ecommerce') || href.includes('ecommerce')) {
    console.log('Detected: ecommerce (from path/href)');
    return 'ecommerce';
  }
  if (path.includes('medienförderung') || href.includes('medienförderung')) {
    console.log('Detected: medienförderung (from path/href)');
    return 'medienförderung';
  }
  
  // Additional check based on document title
  if (document.title.includes('Medienförderung')) {
    console.log('Detected: medienförderung (from title)');
    return 'medienförderung';
  }
  if (document.title.includes('E-Commerce')) {
    console.log('Detected: ecommerce (from title)');
    return 'ecommerce';
  }
  if (document.title.includes('E-Government')) {
    console.log('Detected: egovernment (from title)');
    return 'egovernment';
  }
  if (document.title.includes('Digitale Kompetenz')) {
    console.log('Detected: digitalekompetenz (from title)');
    return 'digitalekompetenz';
  }
  
  console.log('Default fallback: digitalekompetenz');
  // Default fallback: digitalekompetenz
  return 'digitalekompetenz';
}

function setupScrolly() {
  if (typeof $ !== 'undefined') {
    $('.scrolly').scrolly({ anchor: 'middle', speed: 700 });
  }
} 