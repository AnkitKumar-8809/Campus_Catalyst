// === Logout Handler (call via onclick="logout()" or via event) ===
function logout() {
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}
(function() {
  // Utility
  const $ = id => document.getElementById(id);

  // Fill user info if present
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.name) $('userName').textContent = user.name;
  if (user.email) $('userEmail').textContent = user.email;
  if (user.created) $('userCreated').textContent = `Member since: ${user.created}`;

  //--- DARK/LIGHT THEME ---
  function setTheme(dark) {
    document.body.classList.toggle('dark', dark);
    $('themeIcon').textContent = dark ? '☀️' : '🌙';
    localStorage.setItem('_theme', dark ? 'dark' : 'light');
  }
  $('themeSwitch').onclick = () => setTheme(!document.body.classList.contains('dark'));
  // Auto-init theme
  setTheme(localStorage.getItem('_theme') === 'dark');

  //--- LOCAL STORAGE FOR PERSISTENCE ---
  const STORAGE_KEY = '_student_dashboard_data_v2';
  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
  function loadState() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch { return {}; }
  }

  //--- STATE ---
  let state = loadState();
  state.about = state.about || '';
  state.skills = state.skills || [];
  state.projects = state.projects || [];
  state.experiences = state.experiences || [];

  //--- ABOUT SECTION ---
  let isAboutEditing = false;
  function renderAbout() {
    if (isAboutEditing) {
      $('aboutForm').style.display = '';
      $('aboutDisplay').style.display = 'none';
      $('aboutInput').value = state.about;
      $('aboutInput').focus();
    } else {
      $('aboutForm').style.display = 'none';
      $('aboutDisplay').style.display = '';
      $('aboutDisplay').innerHTML = state.about ? `<span>${state.about.replace(/\n/g,'<br>')}</span> <button class="edit-btn" title="Edit about">Edit</button>`
        : `<span style="color:#a3a3b7;">No info yet.</span> <button class="edit-btn" title="Add about">Add</button>`;
      const btn = $('aboutDisplay').querySelector('.edit-btn');
      if (btn) btn.onclick = () => { isAboutEditing = true; renderAbout(); };
    }
  }
  $('aboutForm').onsubmit = function(e) {
    e.preventDefault();
    state.about = $('aboutInput').value.trim().slice(0,300);
    isAboutEditing = false;
    saveState(); renderAbout();
  };
  $('aboutCancelBtn').onclick = function() {
    isAboutEditing = false; renderAbout();
  };
  renderAbout();

  //--- SKILLS ---
  function renderSkills() {
    $('skillsList').innerHTML = '';
    state.skills.forEach((skill, idx) => {
      let editing = skill._edit;
      const li = document.createElement('li');
      if (editing) {
        li.innerHTML =
          `<div style="flex:1"><input id="skillEdit${idx}" value="${skill.value}"/></div>
           <div class="item-actions">
             <button class="save-btn" title="Save">✔</button>
             <button class="cancel-btn" title="Cancel">✖</button>
           </div>`;
        // save/cancel actions
        li.querySelector('.save-btn').onclick = () => {
          let val = $(`skillEdit${idx}`).value.trim();
          if (val) { state.skills[idx] = {value:val}; saveState(); renderSkills(); }
        };
        li.querySelector('.cancel-btn').onclick = () => { delete state.skills[idx]._edit; renderSkills(); };
      } else {
        li.innerHTML =
          `<div class="item-content"><span class="skill-tag">${skill.value}</span></div>
           <div class="item-actions">
             <button class="edit-btn" title="Edit">✎</button>
             <button class="delete-btn" title="Delete">🗑</button>
           </div>`;
        li.querySelector('.edit-btn').onclick = () => { state.skills[idx]._edit = true; renderSkills(); };
        li.querySelector('.delete-btn').onclick = () => { state.skills.splice(idx, 1); saveState(); renderSkills(); };
      }
      $('skillsList').appendChild(li);
    });
  }
  $('skillsForm').onsubmit = function(e) {
    e.preventDefault();
    let val = $('skillInput').value.trim();
    if (val && !state.skills.some(s => s.value.toLowerCase()===val.toLowerCase())) {
      state.skills.push({value:val});
      saveState(); $('skillInput').value=''; renderSkills();
    }
  };
  renderSkills();

  //--- PROJECTS ---
  function renderProjects() {
    $('projectsList').innerHTML = '';
    state.projects.forEach((prj, idx) => {
      let editing = prj._edit;
      const li = document.createElement('li');
      if (editing) {
        li.innerHTML =
          `<div style="flex:3">
            <input id="prjNameEdit${idx}" value="${prj.name}" style="width:104px" maxlength="40"/>
            <input id="prjDescEdit${idx}" value="${prj.desc||''}" style="width:140px" maxlength="60"/>
          </div>
          <div class="item-actions">
            <button class="save-btn" title="Save">✔</button>
            <button class="cancel-btn" title="Cancel">✖</button>
          </div>`;
        // save/cancel
        li.querySelector('.save-btn').onclick = () => {
          let name = $(`prjNameEdit${idx}`).value.trim();
          let desc = $(`prjDescEdit${idx}`).value.trim();
          if (name) { state.projects[idx]={name,desc}; saveState(); renderProjects(); }
        };
        li.querySelector('.cancel-btn').onclick = () => { delete state.projects[idx]._edit; renderProjects(); };
      } else {
        li.innerHTML =
          `<div class="item-content"><b>${prj.name}</b> ${prj.desc?': '+prj.desc:''}</div>
           <div class="item-actions">
             <button class="edit-btn" title="Edit">✎</button>
             <button class="delete-btn" title="Delete">🗑</button>
           </div>`;
        li.querySelector('.edit-btn').onclick = () => { state.projects[idx]._edit=true; renderProjects(); };
        li.querySelector('.delete-btn').onclick = () => { state.projects.splice(idx,1); saveState(); renderProjects();};
      }
      $('projectsList').appendChild(li);
    });
  }
  $('projectsForm').onsubmit = function(e) {
    e.preventDefault();
    let name = $('projectNameInput').value.trim();
    let desc = $('projectDescInput').value.trim();
    if (name) {
      state.projects.push({name,desc});
      $('projectNameInput').value=''; $('projectDescInput').value = '';
      saveState(); renderProjects();
    }
  };
  renderProjects();

  //--- EXPERIENCE ---
  function renderExperiences() {
    $('experienceList').innerHTML = '';
    state.experiences.forEach((exp, idx) => {
      let editing = exp._edit;
      const li = document.createElement('li');
      if (editing) {
        li.innerHTML =
          `<div style="flex:9">
            <input id="expRoleEdit${idx}" value="${exp.role}" style="width:80px" maxlength="24"/>
            <input id="expCompanyEdit${idx}" value="${exp.company}" style="width:90px" maxlength="32"/>
            <input id="expDurationEdit${idx}" value="${exp.duration}" style="width:68px" maxlength="20"/>
          </div>
          <div class="item-actions">
            <button class="save-btn" title="Save">✔</button>
            <button class="cancel-btn" title="Cancel">✖</button>
          </div>`;
        li.querySelector('.save-btn').onclick = () => {
          let role = $(`expRoleEdit${idx}`).value.trim();
          let company = $(`expCompanyEdit${idx}`).value.trim();
          let duration = $(`expDurationEdit${idx}`).value.trim();
          if (role&&company&&duration) {
            state.experiences[idx]={role,company,duration};
            saveState(); renderExperiences();
          }
        };
        li.querySelector('.cancel-btn').onclick = () => { delete state.experiences[idx]._edit; renderExperiences(); };
      } else {
        li.innerHTML =
          `<div class="item-content"><b>${exp.role}</b> at <b>${exp.company}</b> <span style="color:#888">(${exp.duration})</span></div>
           <div class="item-actions">
             <button class="edit-btn" title="Edit">✎</button>
             <button class="delete-btn" title="Delete">🗑</button>
           </div>`;
        li.querySelector('.edit-btn').onclick = () => { state.experiences[idx]._edit=true; renderExperiences(); };
        li.querySelector('.delete-btn').onclick = () => { state.experiences.splice(idx,1); saveState(); renderExperiences(); };
      }
      $('experienceList').appendChild(li);
    });
  }
  $('experienceForm').onsubmit = function(e) {
    e.preventDefault();
    let role = $('experienceRoleInput').value.trim();
    let company = $('experienceCompanyInput').value.trim();
    let duration = $('experienceDurationInput').value.trim();
    if (role && company && duration) {
      state.experiences.push({role,company,duration});
      $('experienceRoleInput').value=''; $('experienceCompanyInput').value=''; $('experienceDurationInput').value='';
      saveState(); renderExperiences();
    }
  };
  renderExperiences();
})();
