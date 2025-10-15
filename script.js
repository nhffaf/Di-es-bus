document.addEventListener('DOMContentLoaded', function () {
    const scheduleData = {
        bus2: {
            workdays: {
                fromSunnyBeach: ['06:50', '07:30', '08:30', '09:30', '10:30', '11:40', '12:45', '13:45', '14:40', '15:30', '16:30', '17:50', '18:45', '20:00'],
                fromNessebar: ['07:10', '08:00', '09:00', '10:00', '11:00', '12:25', '13:10', '14:15', '15:00', '16:00', '17:10', '18:20', '19:15', '20:30'],
            },
            weekends: {
                fromSunnyBeach: ['07:35', '08:30', '11:15', '14:15', '16:00', '17:30'],
                fromNessebar: ['08:15', '09:30', '12:30', '14:45', '16:45', '18:15'],
            }
        },
        bus10: {
            fromSunnyBeach: ['06:10*', '06:10', '06:50', '07:30', '08:10', '08:50', '09:30', '10:10', '10:50', '11:30', '12:10', '12:50', '13:30', '14:10', '14:50', '15:30', '16:10', '16:50', '17:30', '18:10', '18:50', '19:30', '20:20', '21:00'],
            fromBurgas: ['06:10', '06:50', '07:30', '08:10', '08:50', '09:30', '10:10', '10:50', '11:30', '12:10', '12:50', '13:30', '14:10', '14:50', '15:30', '16:10', '16:50', '17:30', '18:10', '18:50', '19:30', '20:20*', '20:50', '22:05'],
        }
    };

    // Theme switcher
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme') || 'light';
    body.className = savedTheme + '-theme';
    themeToggle.checked = savedTheme === 'dark';

    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            body.className = 'dark-theme';
            localStorage.setItem('theme', 'dark');
        } else {
            body.className = 'light-theme';
            localStorage.setItem('theme', 'light');
        }
    });

    // Populate schedules
    function populateSchedule() {
        // Bus 2 Workdays
        const b2w_sb = document.querySelector('#bus-2-workdays .schedule-column:nth-child(1) ul');
        scheduleData.bus2.workdays.fromSunnyBeach.forEach(time => b2w_sb.innerHTML += `<li>${time}</li>`);
        const b2w_n = document.querySelector('#bus-2-workdays .schedule-column:nth-child(2) ul');
        scheduleData.bus2.workdays.fromNessebar.forEach(time => b2w_n.innerHTML += `<li>${time}</li>`);
        
        // Bus 2 Weekends
        const b2we_sb = document.querySelector('#bus-2-weekends .schedule-column:nth-child(1) ul');
        scheduleData.bus2.weekends.fromSunnyBeach.forEach(time => b2we_sb.innerHTML += `<li>${time}</li>`);
        const b2we_n = document.querySelector('#bus-2-weekends .schedule-column:nth-child(2) ul');
        scheduleData.bus2.weekends.fromNessebar.forEach(time => b2we_n.innerHTML += `<li>${time}</li>`);

        // Bus 10
        const b10_sb = document.querySelector('#bus-10 .schedule-column:nth-child(1) ul');
        scheduleData.bus10.fromSunnyBeach.forEach(time => b10_sb.innerHTML += `<li>${time}</li>`);
        const b10_b = document.querySelector('#bus-10 .schedule-column:nth-child(2) ul');
        scheduleData.bus10.fromBurgas.forEach(time => b10_b.innerHTML += `<li>${time}</li>`);
    }

    // Function to show correct schedule tab
    window.showSchedule = (busId, scheduleType) => {
        const busCard = document.getElementById(busId);
        busCard.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        busCard.querySelectorAll('.schedule-content').forEach(content => content.classList.remove('active'));
        
        busCard.querySelector(`button[onclick="showSchedule('${busId}', '${scheduleType}')"]`).classList.add('active');
        busCard.querySelector(`#${busId}-${scheduleType}`).classList.add('active');
    }

    // Current location logic
    function timeToMinutes(time) {
        const [hours, minutes] = time.replace('*', '').split(':').map(Number);
        return hours * 60 + minutes;
    }

    function updateBusStatuses() {
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday
        
        // Remove previous next-bus classes
        document.querySelectorAll('.next-bus').forEach(el => el.classList.remove('next-bus'));

        // --- Bus 2 Status ---
        const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
        const bus2Schedule = isWeekend ? scheduleData.bus2.weekends : scheduleData.bus2.workdays;
        
        const lastDepartureFromSB = [...bus2Schedule.fromSunnyBeach].reverse().find(time => timeToMinutes(time) <= currentMinutes);
        const lastDepartureFromNessebar = [...bus2Schedule.fromNessebar].reverse().find(time => timeToMinutes(time) <= currentMinutes);
        
        const status2 = document.getElementById('status-2');
        if (!lastDepartureFromSB && !lastDepartureFromNessebar) {
            status2.textContent = "Автобусът все още не е започнал курсове за деня.";
        } else if (timeToMinutes(lastDepartureFromSB || '00:00') > timeToMinutes(lastDepartureFromNessebar || '00:00')) {
            status2.textContent = "В момента пътува към Несебър (Старият град).";
        } else {
            status2.textContent = "В момента пътува към Слънчев бряг (Аквапарк).";
        }
        
        // Highlight next bus for Bus 2
        const activeScheduleId = isWeekend ? 'bus-2-weekends' : 'bus-2-workdays';
        const activeScheduleContainer = document.getElementById(activeScheduleId);
        
        const nextFromSB_2 = bus2Schedule.fromSunnyBeach.find(time => timeToMinutes(time) > currentMinutes);
        if (nextFromSB_2) {
            const times = activeScheduleContainer.querySelectorAll('.schedule-column:nth-child(1) li');
            [...times].find(li => li.textContent === nextFromSB_2).classList.add('next-bus');
        }

        const nextFromNessebar_2 = bus2Schedule.fromNessebar.find(time => timeToMinutes(time) > currentMinutes);
         if (nextFromNessebar_2) {
            const times = activeScheduleContainer.querySelectorAll('.schedule-column:nth-child(2) li');
            [...times].find(li => li.textContent === nextFromNessebar_2).classList.add('next-bus');
        }

        // --- Bus 10 Status ---
        const bus10Schedule = scheduleData.bus10;
        const lastDepartureFromSB10 = [...bus10Schedule.fromSunnyBeach].reverse().find(time => timeToMinutes(time) <= currentMinutes);
        const lastDepartureFromBurgas10 = [...bus10Schedule.fromBurgas].reverse().find(time => timeToMinutes(time) <= currentMinutes);

        const status10 = document.getElementById('status-10');
         if (!lastDepartureFromSB10 && !lastDepartureFromBurgas10) {
            status10.textContent = "Автобусът все още не е започнал курсове за деня.";
        } else if (timeToMinutes(lastDepartureFromSB10 || '00:00') > timeToMinutes(lastDepartureFromBurgas10 || '00:00')) {
            status10.textContent = "В момента пътува към Бургас.";
        } else {
            status10.textContent = "В момента пътува към Слънчев бряг.";
        }

        // Highlight next bus for Bus 10
        const activeScheduleContainer10 = document.getElementById('bus-10');

        const nextFromSB_10 = bus10Schedule.fromSunnyBeach.find(time => timeToMinutes(time) > currentMinutes);
        if(nextFromSB_10) {
            const times = activeScheduleContainer10.querySelectorAll('.schedule-column:nth-child(1) li');
            [...times].find(li => li.textContent === nextFromSB_10).classList.add('next-bus');
        }

        const nextFromBurgas_10 = bus10Schedule.fromBurgas.find(time => timeToMinutes(time) > currentMinutes);
        if(nextFromBurgas_10) {
            const times = activeScheduleContainer10.querySelectorAll('.schedule-column:nth-child(2) li');
            [...times].find(li => li.textContent === nextFromBurgas_10).classList.add('next-bus');
        }
    }
    

    // Initial calls
    populateSchedule();
    updateBusStatuses();
    setInterval(updateBusStatuses, 30000); // Update every 30 seconds

    // Set correct tab for Bus 2 on load
    const isWeekend = (new Date().getDay() === 0 || new Date().getDay() === 6);
    if (isWeekend) {
        showSchedule('bus-2', 'weekends');
    } else {
        showSchedule('bus-2', 'workdays');
    }

});
