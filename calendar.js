// 1. Tab Switching Logic (Remains the same)
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tab-link");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
    
    if(tabName === 'CalendarView') {
        window.dispatchEvent(new Event('resize'));
    }
}

// 2. FullCalendar with LocalStorage Persistence
document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');

    // Function to load events from local storage
    const getStoredEvents = () => {
        const saved = localStorage.getItem('calendarEvents');
        return saved ? JSON.parse(saved) : [];
    };

    // Function to save all current events to local storage
    const saveEvents = () => {
        const allEvents = calendar.getEvents().map(event => ({
            title: event.title,
            start: event.startStr,
            end: event.endStr,
            allDay: event.allDay
        }));
        localStorage.setItem('calendarEvents', JSON.stringify(allEvents));
    };

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek'
        },
        events: getStoredEvents(), // Load events on startup
        selectable: true,
        select: function(info) {
            var title = prompt('Enter Event Title:');
            if (title) {
                calendar.addEvent({
                    title: title,
                    start: info.startStr,
                    end: info.endStr,
                    allDay: info.allDay,
                    backgroundColor: '#0066cc', // Classic Wiki Blue
                    borderColor: '#004488'
                });
                saveEvents(); // Save immediately after adding
            }
            calendar.unselect();
        },
        eventClick: function(info) {
            if (confirm("Delete " + info.event.title + "?")) {
                info.event.remove();
                saveEvents(); // Save immediately after removing
            }
        }
    });

    calendar.render();
});