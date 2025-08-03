// Your existing JS (typing effect, nav toggle, theme toggle)
AOS.init();
const text = "Challenge Yourself with Campus Hackathons";
let i = 0;
function typeWriter() {
  if (i < text.length) {
    document.getElementById("typing-text").innerHTML += text.charAt(i);
    i++;
    setTimeout(typeWriter, 60);
  }
}
window.onload = typeWriter;

document.getElementById('nav-toggle').onclick = function () {
  document.getElementById('nav-links').classList.toggle('show');
};

const themeToggle = document.getElementById("theme-toggle");
themeToggle.onclick = () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
};

// NEW: Global Community Functionality
(function() {
  // Tabs Switching
  const tabs = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      contents.forEach(c => c.classList.remove('active'));
      document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
    });
  });

  // LocalStorage Helpers
  function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }
  function loadData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
  }

  // Events
  const eventForm = document.getElementById('event-form');
  const eventList = document.getElementById('event-list');
  let events = loadData('global-events');

  function renderEvents() {
    eventList.innerHTML = '';
    events.forEach(event => {
      const card = document.createElement('div');
      card.classList.add('global-card');
      card.innerHTML = `
        <h4>${event.title}</h4>
        <p><strong>Date:</strong> ${event.date} • <strong>Location:</strong> ${event.location}</p>
        <p>${event.desc}</p>
      `;
      eventList.appendChild(card);
    });
  }

  eventForm.addEventListener('submit', e => {
    e.preventDefault();
    const newEvent = {
      title: document.getElementById('event-title').value,
      date: document.getElementById('event-date').value,
      location: document.getElementById('event-location').value,
      desc: document.getElementById('event-desc').value
    };
    events.push(newEvent);
    saveData('global-events', events);
    renderEvents();
    eventForm.reset();
  });

  renderEvents();

  // Notes
  const noteForm = document.getElementById('note-form');
  const noteList = document.getElementById('note-list');
  let notes = loadData('global-notes');

  function renderNotes() {
    noteList.innerHTML = '';
    notes.forEach(note => {
      const card = document.createElement('div');
      card.classList.add('global-card');
      card.innerHTML = `
        <h4>${note.title}</h4>
        <p>${note.content}</p>
        ${note.link ? `<a href="${note.link}" target="_blank">View Link</a>` : ''}
      `;
      noteList.appendChild(card);
    });
  }

  noteForm.addEventListener('submit', e => {
    e.preventDefault();
    const newNote = {
      title: document.getElementById('note-title').value,
      content: document.getElementById('note-content').value,
      link: document.getElementById('note-link').value
    };
    notes.push(newNote);
    saveData('global-notes', notes);
    renderNotes();
    noteForm.reset();
  });

  renderNotes();

  // Teammates
  const teammateForm = document.getElementById('teammate-form');
  const teammateList = document.getElementById('teammate-list');
  let teammates = loadData('global-teammates');

  function renderTeammates() {
    teammateList.innerHTML = '';
    teammates.forEach(req => {
      const card = document.createElement('div');
      card.classList.add('global-card');
      card.innerHTML = `
        <h4>${req.project}</h4>
        <p><strong>Skills Needed:</strong> ${req.skills}</p>
        <p><strong>Contact:</strong> ${req.contact}</p>
      `;
      teammateList.appendChild(card);
    });
  }

  teammateForm.addEventListener('submit', e => {
    e.preventDefault();
    const newReq = {
      project: document.getElementById('teammate-project').value,
      skills: document.getElementById('teammate-skills').value,
      contact: document.getElementById('teammate-contact').value
    };
    teammates.push(newReq);
    saveData('global-teammates', teammates);
    renderTeammates();
    teammateForm.reset();
  });

  renderTeammates();

  // Clubs (Pre-populated, with join toggle)
  const clubList = document.getElementById('club-list');
  let clubs = loadData('global-clubs') || [
    { name: 'Coding Club', desc: 'Learn and code together.', joined: false },
    { name: 'Design Society', desc: 'Creative design workshops.', joined: false },
    { name: 'Entrepreneurship Group', desc: 'Build startups.', joined: false }
  ];

  function renderClubs() {
    clubList.innerHTML = '';
    clubs.forEach((club, idx) => {
      const card = document.createElement('div');
      card.classList.add('global-card');
      card.innerHTML = `
        <h4>${club.name}</h4>
        <p>${club.desc}</p>
        <button class="join-btn ${club.joined ? 'joined' : ''}" data-idx="${idx}">
          ${club.joined ? 'Joined' : 'Join'}
        </button>
      `;
      clubList.appendChild(card);
    });

    // Join Button Listeners
    document.querySelectorAll('.join-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = btn.dataset.idx;
        clubs[idx].joined = !clubs[idx].joined;
        saveData('global-clubs', clubs);
        renderClubs();
      });
    });
  }

  renderClubs();
})();
// Existing JS remains, update render functions to include poster info, view profile, contact, download

// Events Render
function renderEvents() {
  eventList.innerHTML = '';
  events.forEach(event => {
    const card = document.createElement('div');
    card.classList.add('global-card');
    card.innerHTML = `
      <h4>${event.title}</h4>
      <p><strong>Date:</strong> ${event.date} • <strong>Location:</strong> ${event.location}</p>
      <p>${event.desc}</p>
      <p><em>Posted by: ${event.poster}</em></p>
      <div class="actions">
        <a href="profile-view.html?user=${encodeURIComponent(event.posterEmail)}" class="view-profile">View Profile</a>
        <a href="mailto:${event.posterEmail}" class="contact">Contact</a>
      </div>
    `;
    eventList.appendChild(card);
  });
}

// Notes Render (with Download)
function renderNotes() {
  noteList.innerHTML = '';
  notes.forEach((note, idx) => {
    const card = document.createElement('div');
    card.classList.add('global-card');
    let attachmentsHtml = '';
    if (note.attachments && note.attachments.length) {
      attachmentsHtml = '<div class="attachments"><strong>Attachments:</strong><br>';
      note.attachments.forEach((att, i) => {
        if(att.type.startsWith('image/')) {
          attachmentsHtml += `<a href="${att.data}" download="${att.filename}" target="_blank">
            <img src="${att.data}" alt="${att.filename}" style="max-width:90px;max-height:60px;vertical-align:middle;margin:5px;">
          </a>`;
        } else if(att.type === 'application/pdf') {
          attachmentsHtml += `<a href="${att.data}" download="${att.filename}" target="_blank" style="margin-right:8px;">
            📄 ${att.filename}
          </a>`;
        } else {
          attachmentsHtml += `<a href="${att.data}" download="${att.filename}">${att.filename}</a> `;
        }
      });
      attachmentsHtml += '</div>';
    }

    card.innerHTML = `
      <h4>${note.title}</h4>
      <p>${note.content}</p>
      ${attachmentsHtml}
      <p><em>Posted by: ${note.poster}</em></p>
      <div class="actions">
        <a href="profile-view.html?user=${encodeURIComponent(note.posterEmail)}" class="view-profile">View Profile</a>
        <a href="mailto:${note.posterEmail}" class="contact">Contact</a>
        <button class="download" onclick="downloadNote('${note.title.replace(/'/g,"")}', \`${note.content.replace(/`/g,"\\`")}\`)">Download</button>
      </div>
    `;
    noteList.appendChild(card);
  });
}

// Download Function
function downloadNote(title, content) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

// Teammates Render
function renderTeammates() {
  teammateList.innerHTML = '';
  teammates.forEach(req => {
    const card = document.createElement('div');
    card.classList.add('global-card');
    card.innerHTML = `
      <h4>${req.project}</h4>
      <p><strong>Skills Needed:</strong> ${req.skills}</p>
      <p><strong>Contact:</strong> ${req.contact}</p>
      <p><em>Posted by: ${req.poster}</em></p>
      <div class="actions">
        <a href="profile-view.html?user=${encodeURIComponent(req.posterEmail)}" class="view-profile">View Profile</a>
        <a href="mailto:${req.posterEmail}" class="contact">Contact</a>
      </div>
    `;
    teammateList.appendChild(card);
  });
}

