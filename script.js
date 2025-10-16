// Bus Schedule Data
const busSchedules = {
    2: {
        name: "Автобус №2",
        route: "Солнечный берег (Аквапарк) – Несебр (Старый город)",
        weekdays: {
            fromSunny: ["06:50", "07:30", "08:30", "09:30", "10:30", "11:40", "12:45", "13:45", "14:40", "15:30", "16:30", "17:50", "18:45", "20:00"],
            fromNesebar: ["07:10", "08:00", "09:00", "10:00", "11:00", "12:25", "13:10", "14:15", "15:00", "16:00", "17:10", "18:20", "19:15", "20:30"]
        },
        weekends: {
            fromSunny: ["07:35", "08:30", "11:15", "14:15", "16:00", "17:30"],
            fromNesebar: ["08:15", "09:30", "12:30", "14:45", "16:45", "18:15"]
        }
    },
    10: {
        name: "Автобус №10",
        route: "Солнечный берег – Несебр – Равда – Ахелой – Поморие – Бургас",
        weekdays: {
            fromSunny: ["06:10*", "06:10", "06:50", "07:30", "08:10", "08:50", "09:30", "10:10", "10:50", "11:30", "12:10", "12:50", "13:30", "14:10", "14:50", "15:30", "16:10", "16:50", "17:30", "18:10", "18:50", "19:30", "20:20", "21:00"],
            fromBurgas: ["06:10", "06:50", "07:30", "08:10", "08:50", "09:30", "10:10", "10:50", "11:30", "12:10", "12:50", "13:30", "14:10", "14:50", "15:30", "16:10", "16:50", "17:30", "18:10", "18:50", "19:30", "20:20*", "20:50", "22:05"]
        },
        weekends: {
            fromSunny: ["06:10", "06:50", "07:30", "08:10", "08:50", "09:30", "10:10", "10:50", "11:30", "12:10", "12:50", "13:30", "14:10", "14:50", "15:30", "16:10", "16:50", "17:30", "18:10", "18:50", "19:30", "20:20", "21:00"],
            fromBurgas: ["06:10", "06:50", "07:30", "08:10", "08:50", "09:30", "10:10", "10:50", "11:30", "12:10", "12:50", "13:30", "14:10", "14:50", "15:30", "16:10", "16:50", "17:30", "18:10", "18:50", "19:30", "20:50", "22:05"]
        }
    }
};

// Route stops for tracking
const routeStops = {
    2: {
        fromSunny: [
            { name: "Солнечный берег (Аквапарк)", time: 0 },
            { name: "Солнечный берег (центр)", time: 5 },
            { name: "Солнечный берег (отели)", time: 10 },
            { name: "Несебр (въезд)", time: 20 },
            { name: "Несебр (Старый город)", time: 25 }
        ],
        fromNesebar: [
            { name: "Несебр (Старый город)", time: 0 },
            { name: "Несебр (въезд)", time: 5 },
            { name: "Солнечный берег (отели)", time: 15 },
            { name: "Солнечный берег (центр)", time: 20 },
            { name: "Солнечный берег (Аквапарк)", time: 25 }
        ]
    },
    10: {
        fromSunny: [
            { name: "Солнечный берег", time: 0 },
            { name: "Несебр", time: 15 },
            { name: "Равда", time: 25 },
            { name: "Ахелой", time: 35 },
            { name: "Поморие", time: 45 },
            { name: "Бургас", time: 60 }
        ],
        fromBurgas: [
            { name: "Бургас", time: 0 },
            { name: "Поморие", time: 15 },
            { name: "Ахелой", time: 25 },
            { name: "Равда", time: 35 },
            { name: "Несебр", time: 45 },
            { name: "Солнечный берег", time: 60 }
        ]
    }
};

class BusScheduleApp {
    constructor() {
        this.currentTime = new Date();
        this.isWeekend = this.checkIfWeekend();
        this.init();
    }

    init() {
        this.updateCurrentTime();
        this.setupEventListeners();
        this.populateSchedules();
        this.updateBusStatus();
        this.startTimeUpdate();
    }

    checkIfWeekend() {
        const day = this.currentTime.getDay();
        return day === 0 || day === 6; // Sunday or Saturday
    }

    updateCurrentTime() {
        this.currentTime = new Date();
        const timeString = this.currentTime.toLocaleTimeString('bg-BG', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        document.getElementById('currentTime').textContent = timeString;
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabId = e.target.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });

        // Time slot clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('time-slot')) {
                this.handleTimeSlotClick(e.target);
            }
        });
    }

    switchTab(tabId) {
        // Remove active class from all tabs and contents
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        // Add active class to clicked tab and corresponding content
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        document.getElementById(tabId).classList.add('active');
    }

    populateSchedules() {
        Object.keys(busSchedules).forEach(busNumber => {
            const schedule = busSchedules[busNumber];
            
            // Weekdays
            this.populateTimeGrid(`times-from-sunny-${busNumber}`, schedule.weekdays.fromSunny);
            this.populateTimeGrid(`times-from-nesebar-${busNumber}`, schedule.weekdays.fromNesebar);
            this.populateTimeGrid(`times-from-burgas-${busNumber}`, schedule.weekdays.fromBurgas);

            // Weekends
            this.populateTimeGrid(`times-from-sunny-weekend-${busNumber}`, schedule.weekends.fromSunny);
            this.populateTimeGrid(`times-from-nesebar-weekend-${busNumber}`, schedule.weekends.fromNesebar);
            this.populateTimeGrid(`times-from-burgas-weekend-${busNumber}`, schedule.weekends.fromBurgas);
        });
    }

    populateTimeGrid(containerId, times) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';
        times.forEach(time => {
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot';
            timeSlot.textContent = time;
            
            if (time.includes('*')) {
                timeSlot.classList.add('school-only');
            }

            container.appendChild(timeSlot);
        });
    }

    updateBusStatus() {
        const currentBus = this.findCurrentBus();
        if (currentBus) {
            this.displayBusStatus(currentBus);
        } else {
            this.displayNoBusStatus();
        }
    }

    findCurrentBus() {
        const currentTimeStr = this.currentTime.toLocaleTimeString('bg-BG', {
            hour: '2-digit',
            minute: '2-digit'
        });

        for (const busNumber in busSchedules) {
            const schedule = this.isWeekend ? busSchedules[busNumber].weekends : busSchedules[busNumber].weekdays;
            
            // Check all directions
            const directions = ['fromSunny', 'fromNesebar', 'fromBurgas'];
            for (const direction of directions) {
                if (schedule[direction]) {
                    const times = schedule[direction];
                    const currentIndex = this.findCurrentTimeIndex(times, currentTimeStr);
                    
                    if (currentIndex !== -1) {
                        return {
                            busNumber: parseInt(busNumber),
                            direction: direction,
                            currentTime: times[currentIndex],
                            nextTime: times[currentIndex + 1] || null,
                            isCurrent: true
                        };
                    }
                }
            }
        }

        return null;
    }

    findCurrentTimeIndex(times, currentTimeStr) {
        const currentMinutes = this.timeToMinutes(currentTimeStr);
        
        for (let i = 0; i < times.length; i++) {
            const timeMinutes = this.timeToMinutes(times[i].replace('*', ''));
            const nextTimeMinutes = i < times.length - 1 ? 
                this.timeToMinutes(times[i + 1].replace('*', '')) : 
                this.timeToMinutes(times[0].replace('*', '')) + 24 * 60; // Next day

            // Check if current time is within 30 minutes of this departure
            if (currentMinutes >= timeMinutes && currentMinutes <= timeMinutes + 30) {
                return i;
            }
        }
        
        return -1;
    }

    timeToMinutes(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }

    displayBusStatus(bus) {
        const busInfo = busSchedules[bus.busNumber];
        const directionNames = {
            fromSunny: 'От Солнечного берега',
            fromNesebar: 'От Несебра (Старый город)',
            fromBurgas: 'От Бургаса'
        };

        const stops = routeStops[bus.busNumber][bus.direction];
        const currentLocation = this.getCurrentLocation(stops, bus.currentTime);
        const nextStop = this.getNextStop(stops, bus.currentTime);

        document.getElementById('busNumber').textContent = `№${bus.busNumber}`;
        document.getElementById('busRoute').textContent = busInfo.route;
        document.getElementById('currentLocation').textContent = currentLocation;
        document.getElementById('nextStop').textContent = nextStop;
        document.getElementById('departureTime').textContent = bus.currentTime;
        document.getElementById('arrivalTime').textContent = bus.nextTime || 'Крайна спирка';
    }

    getCurrentLocation(stops, departureTime) {
        const currentMinutes = this.timeToMinutes(this.currentTime.toLocaleTimeString('bg-BG', {
            hour: '2-digit',
            minute: '2-digit'
        }));
        const departureMinutes = this.timeToMinutes(departureTime.replace('*', ''));
        const elapsedMinutes = currentMinutes - departureMinutes;

        for (let i = 0; i < stops.length - 1; i++) {
            if (elapsedMinutes >= stops[i].time && elapsedMinutes < stops[i + 1].time) {
                return `Между ${stops[i].name} и ${stops[i + 1].name}`;
            }
        }

        if (elapsedMinutes >= stops[stops.length - 1].time) {
            return stops[stops.length - 1].name;
        }

        return stops[0].name;
    }

    getNextStop(stops, departureTime) {
        const currentMinutes = this.timeToMinutes(this.currentTime.toLocaleTimeString('bg-BG', {
            hour: '2-digit',
            minute: '2-digit'
        }));
        const departureMinutes = this.timeToMinutes(departureTime.replace('*', ''));
        const elapsedMinutes = currentMinutes - departureMinutes;

        for (let i = 0; i < stops.length - 1; i++) {
            if (elapsedMinutes >= stops[i].time && elapsedMinutes < stops[i + 1].time) {
                return `Следваща: ${stops[i + 1].name}`;
            }
        }

        return 'Крайна спирка';
    }

    displayNoBusStatus() {
        document.getElementById('busNumber').textContent = '-';
        document.getElementById('busRoute').textContent = 'Няма активни автобуси';
        document.getElementById('currentLocation').textContent = '-';
        document.getElementById('nextStop').textContent = '-';
        document.getElementById('departureTime').textContent = '-';
        document.getElementById('arrivalTime').textContent = '-';
    }

    handleTimeSlotClick(timeSlot) {
        // Remove previous selections
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.classList.remove('selected');
        });

        // Add selection to clicked slot
        timeSlot.classList.add('selected');

        // Show info about selected time
        const time = timeSlot.textContent;
        const busNumber = timeSlot.closest('.route-card').getAttribute('data-route');
        this.showTimeInfo(busNumber, time);
    }

    showTimeInfo(busNumber, time) {
        // This could be expanded to show more detailed information
        console.log(`Selected time ${time} for bus ${busNumber}`);
    }

    startTimeUpdate() {
        setInterval(() => {
            this.updateCurrentTime();
            this.updateBusStatus();
            this.updateTimeSlotStates();
        }, 1000);
    }

    updateTimeSlotStates() {
        const currentTimeStr = this.currentTime.toLocaleTimeString('bg-BG', {
            hour: '2-digit',
            minute: '2-digit'
        });

        document.querySelectorAll('.time-slot').forEach(slot => {
            const timeStr = slot.textContent.replace('*', '');
            const timeMinutes = this.timeToMinutes(timeStr);
            const currentMinutes = this.timeToMinutes(currentTimeStr);

            // Remove all state classes
            slot.classList.remove('past', 'current', 'next');

            if (timeMinutes < currentMinutes) {
                slot.classList.add('past');
            } else if (timeMinutes === currentMinutes) {
                slot.classList.add('current');
            } else if (timeMinutes === currentMinutes + 1) {
                slot.classList.add('next');
            }
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BusScheduleApp();
});

// Add some additional animations and effects
document.addEventListener('DOMContentLoaded', () => {
    // Add floating animation to route cards
    const routeCards = document.querySelectorAll('.route-card');
    routeCards.forEach((card, index) => {
        card.style.animationDelay = `${0.1 * index}s`;
    });

    // Add hover effects to time slots
    const timeSlots = document.querySelectorAll('.time-slot');
    timeSlots.forEach(slot => {
        slot.addEventListener('mouseenter', () => {
            slot.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        slot.addEventListener('mouseleave', () => {
            slot.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add click animation to buttons
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.style.transform = 'scale(0.95)';
            setTimeout(() => {
                e.target.style.transform = 'scale(1)';
            }, 150);
        });
    });
});