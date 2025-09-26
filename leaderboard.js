// Student data
const studentData = [
    {
        name: "Alice Johnson",
        rank: 1,
        points: 2450,
        avatar: "A",
        badges: [
            { icon: "fas fa-trophy", class: "gold", title: "Academic Excellence" },
            { icon: "fas fa-calendar-check", class: "blue", title: "Perfect Attendance" },
            { icon: "fas fa-hands-helping", class: "green", title: "Community Service" }
        ]
    },
    {
        name: "Benjamin Chen",
        rank: 2,
        points: 2180,
        avatar: "B",
        badges: [
            { icon: "fas fa-medal", class: "silver", title: "Honor Roll" },
            { icon: "fas fa-crown", class: "purple", title: "Leadership" }
        ]
    },
    {
        name: "Chloe Martinez",
        rank: 3,
        points: 1920,
        avatar: "C",
        badges: [
            { icon: "fas fa-running", class: "bronze", title: "Sports Achievement" },
            { icon: "fas fa-palette", class: "orange", title: "Creative Arts" }
        ]
    },
    {
        name: "David Wilson",
        rank: 4,
        points: 1675,
        avatar: "D",
        badges: [
            { icon: "fas fa-book", class: "blue", title: "Bookworm" },
            { icon: "fas fa-lightbulb", class: "gold", title: "Innovation" }
        ]
    }
];

// DOM elements
const tableBody = document.getElementById('studentTableBody');

// Utility functions
function formatPoints(points) {
    return points.toLocaleString();
}

function getRankSuffix(rank) {
    const suffixes = ["th", "st", "nd", "rd"];
    const v = rank % 100;
    return rank + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

function getRankClass(rank) {
    switch(rank) {
        case 1: return 'rank-1';
        case 2: return 'rank-2';
        case 3: return 'rank-3';
        default: return '';
    }
}

// Create badge HTML
function createBadgeHTML(badge) {
    return `
        <span class="badge ${badge.class}" title="${badge.title}">
            <i class="${badge.icon}"></i>
        </span>
    `;
}

// Create student row HTML
function createStudentRow(student) {
    const badgesHTML = student.badges.map(badge => createBadgeHTML(badge)).join('');
    const rankClass = getRankClass(student.rank);
    
    return `
        <tr class="student-row" data-rank="${student.rank}">
            <td>
                <div class="student-info">
                    <div class="student-avatar">${student.avatar}</div>
                    <span class="student-name">${student.name}</span>
                </div>
            </td>
            <td>
                <span class="rank ${rankClass}">${getRankSuffix(student.rank)}</span>
            </td>
            <td>
                <span class="points">${formatPoints(student.points)}</span>
            </td>
            <td>
                <div class="badges">
                    ${badgesHTML}
                </div>
            </td>
        </tr>
    `;
}

// Render students table
function renderStudentsTable() {
    // Show loading state
    tableBody.innerHTML = `
        <tr>
            <td colspan="4" class="loading">Loading student data...</td>
        </tr>
    `;
    
    // Simulate loading delay for better UX
    setTimeout(() => {
        const studentsHTML = studentData.map(student => createStudentRow(student)).join('');
        tableBody.innerHTML = studentsHTML;
        
        // Add entrance animation
        animateTableRows();
    }, 500);
}

// Animate table rows entrance
function animateTableRows() {
    const rows = document.querySelectorAll('.student-row');
    rows.forEach((row, index) => {
        row.style.opacity = '0';
        row.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            row.style.transition = 'all 0.5s ease';
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Add tooltip functionality for badges
function initializeBadgeTooltips() {
    document.addEventListener('mouseover', function(e) {
        if (e.target.closest('.badge')) {
            const badge = e.target.closest('.badge');
            const title = badge.getAttribute('title');
            
            if (title && !badge.querySelector('.tooltip')) {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = title;
                tooltip.style.cssText = `
                    position: absolute;
                    background: #333;
                    color: white;
                    padding: 5px 10px;
                    border-radius: 5px;
                    font-size: 12px;
                    white-space: nowrap;
                    z-index: 1000;
                    pointer-events: none;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                `;
                
                document.body.appendChild(tooltip);
                
                const rect = badge.getBoundingClientRect();
                tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
                tooltip.style.top = (rect.top - tooltip.offsetHeight - 5) + 'px';
                
                setTimeout(() => tooltip.style.opacity = '1', 10);
            }
        }
    });
    
    document.addEventListener('mouseout', function(e) {
        if (e.target.closest('.badge')) {
            const tooltips = document.querySelectorAll('.tooltip');
            tooltips.forEach(tooltip => {
                tooltip.style.opacity = '0';
                setTimeout(() => tooltip.remove(), 300);
            });
        }
    });
}

// Add search/filter functionality
function addSearchFunctionality() {
    // Create search input
    const searchContainer = document.createElement('div');
    searchContainer.style.cssText = `
        margin-bottom: 20px;
        text-align: center;
    `;
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search students...';
    searchInput.style.cssText = `
        padding: 12px 20px;
        border: 2px solid #e0e0e0;
        border-radius: 25px;
        font-size: 16px;
        width: 300px;
        max-width: 100%;
        outline: none;
        transition: border-color 0.3s ease;
    `;
    
    searchInput.addEventListener('focus', () => {
        searchInput.style.borderColor = 'rgba(76, 175, 80, 0.8)';
    });
    
    searchInput.addEventListener('blur', () => {
        searchInput.style.borderColor = '#e0e0e0';
    });
    
    searchInput.addEventListener('input', (e) => {
        filterStudents(e.target.value);
    });
    
    searchContainer.appendChild(searchInput);
    
    const tableContainer = document.querySelector('.table-container');
    tableContainer.parentNode.insertBefore(searchContainer, tableContainer);
}

// Filter students based on search term
function filterStudents(searchTerm) {
    const rows = document.querySelectorAll('.student-row');
    const term = searchTerm.toLowerCase();
    
    rows.forEach(row => {
        const name = row.querySelector('.student-name').textContent.toLowerCase();
        const points = row.querySelector('.points').textContent;
        const rank = row.querySelector('.rank').textContent;
        
        if (name.includes(term) || points.includes(term) || rank.includes(term)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Add click effects for interactivity
function addClickEffects() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.badge')) {
            const badge = e.target.closest('.badge');
            badge.style.transform = 'scale(0.9)';
            setTimeout(() => {
                badge.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    badge.style.transform = 'scale(1)';
                }, 150);
            }, 150);
        }
    });
}

// Initialize the application
function init() {
    renderStudentsTable();
    
    // Wait for table to render before adding additional features
    setTimeout(() => {
        initializeBadgeTooltips();
        addSearchFunctionality();
        addClickEffects();
    }, 600);
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Add responsive table scroll hint for mobile
function addMobileScrollHint() {
    if (window.innerWidth <= 768) {
        const tableContainer = document.querySelector('.table-container');
        const hint = document.createElement('div');
        hint.textContent = '← Swipe to see more →';
        hint.style.cssText = `
            text-align: center;
            color: #666;
            font-size: 12px;
            margin-top: 10px;
            opacity: 0.7;
        `;
        tableContainer.appendChild(hint);
        
        // Remove hint after user scrolls
        tableContainer.addEventListener('scroll', () => {
            hint.remove();
        }, { once: true });
    }
}

// Add scroll hint on window resize
window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
        setTimeout(addMobileScrollHint, 100);
    }
});

// Add performance monitoring
function logPerformance() {
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
    });
}