// Load user from URL param
const urlParams = new URLSearchParams(window.location.search);
const userEmail = urlParams.get('user');

// Assume profiles are stored in localStorage by email (in real app, fetch from server)
const profile = JSON.parse(localStorage.getItem(`profile-${userEmail}`)) || {};

// Display basic info
document.getElementById('userName').textContent = profile.name || 'Unknown';
document.getElementById('userEmail').textContent = userEmail || 'No email available';

// Render sections read-only
// About
const aboutDisplay = document.getElementById('aboutDisplay');
aboutDisplay.innerHTML = profile.about ? `<span>${profile.about.replace(/\n/g, '<br>')}</span>` : '<span style="color:#a3a3b7;">No info yet.</span>';

// Skills
const skillsList = document.getElementById('skillsList');
skillsList.innerHTML = '';
(profile.skills || []).forEach(skill => {
  const li = document.createElement('li');
  li.innerHTML = `<div class="item-content"><span class="skill-tag">${skill.value}</span></div>`;
  skillsList.appendChild(li);
});

// Projects
const projectsList = document.getElementById('projectsList');
projectsList.innerHTML = '';
(profile.projects || []).forEach(prj => {
  const li = document.createElement('li');
  li.innerHTML = `<div class="item-content"><b>${prj.name}</b> ${prj.desc ? ': ' + prj.desc : ''}</div>`;
  projectsList.appendChild(li);
});

// Experience
const experienceList = document.getElementById('experienceList');
experienceList.innerHTML = '';
(profile.experiences || []).forEach(exp => {
  const li = document.createElement('li');
  li.innerHTML = `<div class="item-content"><b>${exp.role}</b> at <b>${exp.company}</b> <span style="color:#888">(${exp.duration})</span></div>`;
  experienceList.appendChild(li);
});
