const employees = [
  { id: 1, name: "Maya Chen", initials: "MC", role: "Product Manager", team: "Product", location: "Bengaluru", manager: "Anika Shah", win: "Led the customer launch plan and aligned three delivery teams.", focus: "Protect focused time during the next release cycle." },
  { id: 2, name: "Daniel Ortiz", initials: "DO", role: "Support Specialist", team: "Customer", location: "Remote", manager: "Nina Patel", win: "Maintained clear customer handoffs during a busy support week.", focus: "Continue building confidence with complex account troubleshooting." },
  { id: 3, name: "Aisha Rahman", initials: "AR", role: "People Operations Associate", team: "Operations", location: "Mumbai", manager: "Anika Shah", win: "Improved the new-hire equipment checklist.", focus: "Document recurring onboarding questions for the next cohort." },
  { id: 4, name: "Leo Martin", initials: "LM", role: "Software Engineer", team: "Product", location: "Remote", manager: "Rohan Mehta", win: "Reduced a repeated release-check issue with a small automation.", focus: "Share the implementation notes with the engineering team." },
  { id: 5, name: "Priya Nair", initials: "PN", role: "Marketing Designer", team: "Product", location: "Delhi", manager: "Sara Kim", win: "Delivered a clear campaign system ahead of schedule.", focus: "Plan an early review of campaign accessibility requirements." },
  { id: 6, name: "Ethan Brooks", initials: "EB", role: "Account Executive", team: "Customer", location: "Remote", manager: "Nina Patel", win: "Prepared detailed customer context for a renewal discussion.", focus: "Use the new discovery template in the next account review." },
  { id: 7, name: "Sofia Alvarez", initials: "SA", role: "Data Analyst", team: "Operations", location: "Bengaluru", manager: "Rohan Mehta", win: "Created a simpler weekly operations summary.", focus: "Confirm metric definitions with stakeholders before the next report." },
  { id: 8, name: "Noah Williams", initials: "NW", role: "Customer Success Manager", team: "Customer", location: "Pune", manager: "Nina Patel", win: "Coordinated a smooth customer training session.", focus: "Collect structured feedback after the next training session." }
];

const state = { selectedEmployeeId: 1, reviewDrafts: 3 };
const titleByView = { overview: "Overview", people: "People", onboarding: "Onboarding", reviews: "Reviews", ask: "Ask AI HR" };

const employeeList = document.querySelector("#employeeList");
const employeeProfile = document.querySelector("#employeeProfile");
const searchInput = document.querySelector("#employeeSearch");
const reviewEmployee = document.querySelector("#reviewEmployee");
const reviewCount = document.querySelector("#reviewCount");

function selectView(view) {
  document.querySelectorAll(".view").forEach((section) => {
    const active = section.id === view;
    section.hidden = !active;
    section.classList.toggle("active", active);
  });
  document.querySelectorAll(".nav-button").forEach((button) => button.classList.toggle("active", button.dataset.view === view));
  document.querySelector("#pageTitle").textContent = titleByView[view];
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderEmployees(query = "") {
  const matches = employees.filter((employee) => `${employee.name} ${employee.role} ${employee.team} ${employee.location}`.toLowerCase().includes(query.toLowerCase()));
  employeeList.innerHTML = matches.map((employee) => `
    <button class="employee-card ${employee.id === state.selectedEmployeeId ? "active" : ""}" data-id="${employee.id}">
      <span class="avatar">${employee.initials}</span><span><strong>${employee.name}</strong><span>${employee.role} | ${employee.team}</span></span>
    </button>`).join("") || `<p class="empty-state" style="padding:16px">No fictional employees match that search.</p>`;
  document.querySelectorAll(".employee-card").forEach((button) => button.addEventListener("click", () => {
    state.selectedEmployeeId = Number(button.dataset.id);
    renderEmployees(searchInput.value);
    renderProfile();
  }));
}

function renderProfile() {
  const employee = employees.find((item) => item.id === state.selectedEmployeeId);
  employeeProfile.innerHTML = `
    <div class="profile-header"><div><p class="eyebrow">Fictional employee profile</p><h2>${employee.name}</h2><p class="profile-subtitle">${employee.role} | ${employee.team}</p></div><span class="avatar">${employee.initials}</span></div>
    <div class="profile-grid"><div><span>Manager</span><strong>${employee.manager}</strong></div><div><span>Location</span><strong>${employee.location}</strong></div><div><span>Review status</span><strong>Current</strong></div></div>
    <section class="profile-section"><h3>Recent contribution</h3><p><strong>Documented win:</strong> ${employee.win}</p></section>
    <section class="profile-section"><h3>Next conversation</h3><p>${employee.focus}</p></section>
    <section class="profile-section"><h3>Review boundary</h3><p>These fictional notes support a conversation. They are not a score or a recommendation about employment action.</p></section>`;
}

function populateReviewSelect() {
  reviewEmployee.innerHTML = employees.map((employee) => `<option value="${employee.id}">${employee.name} - ${employee.role}</option>`).join("");
}

function formatList(items) { return `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`; }

document.querySelectorAll(".nav-button").forEach((button) => button.addEventListener("click", () => selectView(button.dataset.view)));
document.querySelectorAll("[data-go]").forEach((button) => button.addEventListener("click", () => selectView(button.dataset.go)));
searchInput.addEventListener("input", () => renderEmployees(searchInput.value));

document.querySelector("#onboardingForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const name = data.get("name");
  const role = data.get("role");
  const team = data.get("team") || "the team";
  const date = data.get("date") || "the agreed start date";
  const responsibilities = data.get("responsibilities");
  document.querySelector("#onboardingOutput").innerHTML = `<h3 class="generated-title">${name}'s onboarding pack</h3><p><strong>Role:</strong> ${role} | <strong>Team:</strong> ${team} | <strong>Start:</strong> ${date}</p><h4>First day</h4>${formatList(["Welcome conversation with manager and team introductions.", "Confirm equipment, account access, working hours, and communication channels.", `Review the role focus: ${responsibilities}`])}<h4>First week</h4>${formatList(["Meet key partners and shadow one recurring workflow.", "Set 30-day expectations with the manager.", "Schedule a short check-in at the end of the week to capture open questions."])}<p class="notice">This is a starting draft. A human should add company-specific policies, contacts, and access details before sending it.</p>`;
});

document.querySelector("#reviewForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const employee = employees.find((item) => item.id === Number(data.get("employee")));
  const outcome = data.get("outcome");
  const wins = data.get("wins") || "No additional wins documented in this demo draft.";
  const support = data.get("support") || "Schedule a manager check-in to agree on practical next steps.";
  state.reviewDrafts += 1;
  reviewCount.textContent = state.reviewDrafts;
  document.querySelector("#reviewOutput").innerHTML = `<h3 class="generated-title">Review draft: ${employee.name}</h3><p><strong>Outcome:</strong> ${outcome}</p><h4>Documented wins</h4><p>${wins}</p><h4>Support and follow-up</h4><p>${support}</p><p class="notice">Saved as a browser-only demo draft. A qualified human must verify the facts and decide any follow-up.</p>`;
});

document.querySelectorAll("[data-prompt]").forEach((button) => button.addEventListener("click", () => { document.querySelector("#aiPrompt").value = button.dataset.prompt; }));

document.querySelector("#askButton").addEventListener("click", async () => {
  const prompt = document.querySelector("#aiPrompt").value.trim();
  const output = document.querySelector("#aiOutput");
  const button = document.querySelector("#askButton");
  if (!prompt) { output.textContent = "Write a task first."; return; }
  output.textContent = "Preparing a response...";
  button.disabled = true;
  try {
    const response = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: prompt }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "AI could not respond.");
    output.textContent = data.reply;
  } catch (error) {
    output.textContent = `${error.message}\n\nFor this demo, try a non-sensitive task such as onboarding, a recognition note, or a coaching conversation template.`;
  } finally { button.disabled = false; }
});

renderEmployees();
renderProfile();
populateReviewSelect();
