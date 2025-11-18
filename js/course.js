// ===== Course Array =====
const courses = [
    { code: "CSE 110", name: "Intro to Programming", credits: 2, completed: false, subject: "CSE" },
    { code: "WDD 130", name: "Web Fundamentals", credits: 2, completed: false, subject: "WDD" },
    { code: "CSE 111", name: "Programming with Functions", credits: 2, completed: false, subject: "CSE" },
    { code: "CSE 210", name: "Programming with Classes", credits: 2, completed: false, subject: "CSE" },
    { code: "WDD 131", name: "Dynamic Web Fundamentals", credits: 2, completed: false, subject: "WDD" },
    { code: "WDD 231", name: "Web Frontend Development I", credits: 3, completed: false, subject: "WDD" },

    { code: "ITM 111", name: "Introduction to Databases", credits: 3, completed: false, subject: "ITM" },
    { code: "WDD 330", name: "Web Frontend Development II", credits: 3, completed: false, subject: "WDD" },
    { code: "CSE 340", name: "Web Backend Development", credits: 3, completed: false, subject: "CSE" },
    { code: "CSE 341", name: "Web Services", credits: 3, completed: false, subject: "CSE" },
    { code: "WDD 430", name: "Web Full-Stack Development", credits: 3, completed: false, subject: "WDD" },

    { code: "CSE 212", name: "Programming w/Data Structures", credits: 2, completed: false, subject: "CSE" },
    { code: "CSE 270", name: "Software Testing", credits: 3, completed: false, subject: "CSE" },
    { code: "CSE 300", name: "Professional Readiness", credits: 1, completed: false, subject: "CSE" },
    { code: "CSE 310", name: "Applied Programming", credits: 3, completed: false, subject: "CSE" },
    { code: "CSE 325", name: ".NET Software Development", credits: 3, completed: false, subject: "CSE" },
    { code: "CSE 370", name: "Software Eng. Principles", credits: 3, completed: false, subject: "CSE" }
];

// ===== HTML Elements =====
const courseList = document.querySelector("#courseList");
const totalCredits = document.querySelector("#totalCredits");
const filterButtons = document.querySelectorAll(".filter-btn");

// ===== Render Courses =====
function displayCourses(filteredCourses) {
    courseList.innerHTML = "";

    filteredCourses.forEach(course => {
        const card = document.createElement("div");
        card.classList.add("course-card");
        if (course.completed) card.classList.add("completed");

        card.innerHTML = `
            <h3>${course.code}</h3>
            <p>${course.name}</p>
            <p><strong>Créditos:</strong> ${course.credits}</p>
        `;

        courseList.appendChild(card);
    });

    // Recalculate credits
    const sum = filteredCourses.reduce((acc, c) => acc + c.credits, 0);
    totalCredits.textContent = sum;
}

// ===== Filter Logic =====
function filterCourses(subject) {
    if (subject === "all") {
        displayCourses(courses);
    } else {
        const filtered = courses.filter(course => course.subject === subject);
        displayCourses(filtered);
    }
}

// ===== Event Listeners for Buttons =====
filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const filter = btn.dataset.filter;
        filterCourses(filter);
    });
});

// ===== Initial Load =====
displayCourses(courses);