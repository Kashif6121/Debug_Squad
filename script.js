// Mock login
function login() {
  const name = document.getElementById("username").value;
  if (name) {
    localStorage.setItem("username", name);
    alert("Logged in as " + name);
    window.location.href = "report.html";
  } else {
    alert("Please enter a name.");
  }
}

// Submit issue
function submitIssue(event) {
  event.preventDefault();
  const username = localStorage.getItem("username") || "Guest";

  const issue = {
    id: Date.now(),
    user: username,
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    category: document.getElementById("category").value,
    location: document.getElementById("location").value,
    photo: document.getElementById("photo").files[0]?.name || "No Photo",
    status: "Pending"
  };

  let issues = JSON.parse(localStorage.getItem("issues") || "[]");
  issues.push(issue);
  localStorage.setItem("issues", JSON.stringify(issues));

  alert("Issue submitted!");
  window.location.href = "myissues.html";
}

// Status badge renderer
function getStatusBadge(status) {
  const cls = status.toLowerCase().replace(" ", "");
  return `<span class="status-badge status-${cls}">${status}</span>`;
}

// Load user's issues
function loadMyIssues() {
  const username = localStorage.getItem("username") || "Guest";
  let issues = JSON.parse(localStorage.getItem("issues") || "[]");
  const myIssues = issues.filter(i => i.user === username);

  const container = document.getElementById("myIssuesList");
  if (!myIssues.length) {
    container.innerHTML = "<p>No issues reported yet.</p>";
    return;
  }

  container.innerHTML = myIssues.map(i =>
    `<div class="issue-card">
       <h3>${i.title}</h3>
       <p>${i.description}</p>
       <p><b>Category:</b> ${i.category}</p>
       <p><b>Location:</b> ${i.location}</p>
       <p><b>Status:</b> ${getStatusBadge(i.status)}</p>
     </div>`
  ).join("");
}

// Load all issues (admin)
function loadAllIssues() {
  let issues = JSON.parse(localStorage.getItem("issues") || "[]");

  const categoryFilter = document.getElementById("filterCategory")?.value || "All";
  const statusFilter = document.getElementById("filterStatus")?.value || "All";

  if (categoryFilter !== "All") {
    issues = issues.filter(i => i.category === categoryFilter);
  }
  if (statusFilter !== "All") {
    issues = issues.filter(i => i.status === statusFilter);
  }

  const container = document.getElementById("allIssuesList");
  if (!issues.length) {
    container.innerHTML = "<p>No issues found.</p>";
    return;
  }

  container.innerHTML = issues.map(i =>
    `<div class="issue-card">
       <h3>${i.title}</h3>
       <p>${i.description}</p>
       <p><b>User:</b> ${i.user}</p>
       <p><b>Category:</b> ${i.category}</p>
       <p><b>Location:</b> ${i.location}</p>
       <p><b>Photo:</b> ${i.photo}</p>
       <p><b>Status:</b> 
         <select onchange="updateStatus(${i.id}, this.value)">
           <option ${i.status==="Pending"?"selected":""}>Pending</option>
           <option ${i.status==="In Progress"?"selected":""}>In Progress</option>
           <option ${i.status==="Resolved"?"selected":""}>Resolved</option>
         </select>
         ${getStatusBadge(i.status)}
       </p>
     </div>`
  ).join("");
}

// Update issue status (admin)
function updateStatus(id, newStatus) {
  let issues = JSON.parse(localStorage.getItem("issues") || "[]");
  issues = issues.map(i => i.id === id ? { ...i, status: newStatus } : i);
  localStorage.setItem("issues", JSON.stringify(issues));
  loadAllIssues();
}
