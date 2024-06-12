<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GradeFalcon Schedule</title>
    <link rel="stylesheet" href="../style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.10.2/fullcalendar.min.css" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.10.2/fullcalendar.min.js"></script>
    <script>
        $(document).ready(function() {
            $('#calendar').fullCalendar({
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay'
                },
                defaultDate: new Date(),
                navLinks: true,
                editable: true,
                eventLimit: true,
                events: [
                    {
                        title: 'Graphic fundamentals Final Exam',
                        start: '2024-12-30T13:00:00',
                        end: '2024-12-30T16:00:00'
                    },
                    {
                        title: 'Advanced Web Design Final Exam',
                        start: '2024-12-31T11:30:00',
                        end: '2024-12-31T13:30:00'
                    }
                ]
            });
        });
    </script>
</head>
<body>
    <div class="main-content">
        <header>
            <h2>Schedule</h2>
        </header>
        <section class="calendar">
            <div id="calendar"></div>
        </section>
    </div>
</body>
</html>
