document.addEventListener('DOMContentLoaded', function() {
    const activityData = [
        { date: '2023-08-01', level: 2, details: '1 project completed' },
        { date: '2023-08-02', level: 3, details: '2 projects completed' },
        { date: '2023-08-04', level: 1, details: 'Worked 5 hours' },
        { date: '2023-08-07', level: 4, details: '3 projects completed' },
        // Add more entries as needed
    ];

    const monthNames = ["January", "February", "March", "April", "May", "June", 
                        "July", "August", "September", "October", "November", "December"];
    const yearSelector = document.getElementById('year-selector');
    const monthSelector = document.getElementById('month-selector');
    const gridContainer = document.querySelector('.track-record-grid');

    // Populate year selector (Example: last 5 years)
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 5; i--) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        yearSelector.appendChild(option);
    }

    // Populate month selector
    monthNames.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = index + 1;
        option.textContent = month;
        monthSelector.appendChild(option);
    });

    // Set current month and year as default
    const currentMonth = new Date().getMonth() + 1;
    yearSelector.value = currentYear;
    monthSelector.value = currentMonth;
    loadMonthAndYear(currentYear, currentMonth);

    // Event listener for month and year change
    yearSelector.addEventListener('change', function() {
        loadMonthAndYear(this.value, monthSelector.value);
    });

    monthSelector.addEventListener('change', function() {
        loadMonthAndYear(yearSelector.value, this.value);
    });

    function loadMonthAndYear(year, month) {
        gridContainer.innerHTML = '';  // Clear grid

        const startDate = new Date(`${year}-${month}-01`);
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
        const daysInMonth = endDate.getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';

            const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const activity = activityData.find(data => data.date === date);

            const dateSpan = document.createElement('span');
            dateSpan.textContent = day;
            cell.appendChild(dateSpan);

            if (activity) {
                cell.dataset.level = activity.level;
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.innerText = `${activity.details} on ${activity.date}`;
                cell.appendChild(tooltip);
            } else {
                cell.dataset.level = 0; // No activity
            }

            gridContainer.appendChild(cell);
        }
    }
});
function loadMonth(month) {
    gridContainer.innerHTML = '';  // Clear grid

    fetch(`/api/activityData?month=${month}&year=2023`)
        .then(response => response.json())
        .then(data => {
            const daysInMonth = new Date(2023, month, 0).getDate();
            for (let day = 1; day <= daysInMonth; day++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';

                const date = `2023-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const activity = data.find(d => d.date === date);

                const dateSpan = document.createElement('span');
                dateSpan.textContent = day;
                cell.appendChild(dateSpan);

                if (activity) {
                    cell.dataset.level = activity.level;
                    const tooltip = document.createElement('div');
                    tooltip.className = 'tooltip';
                    tooltip.innerText = `${activity.details} on ${activity.date}`;
                    cell.appendChild(tooltip);
                } else {
                    cell.dataset.level = 0; // No activity
                }

                gridContainer.appendChild(cell);
            }
        });
}