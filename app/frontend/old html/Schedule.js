import React, { useEffect } from 'react';
import $ from 'jquery';
import 'fullcalendar';
import 'fullcalendar/dist/fullcalendar.css';
import moment from 'moment';

const Schedule = () => {
  useEffect(() => {
    $('#calendar').fullCalendar({
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay',
      },
      defaultDate: new Date(),
      navLinks: true,
      editable: true,
      eventLimit: true,
      events: [
        {
          title: 'Graphic fundamentals Final Exam',
          start: '2024-12-30T13:00:00',
          end: '2024-12-30T16:00:00',
        },
        {
          title: 'Advanced Web Design Final Exam',
          start: '2024-12-31T11:30:00',
          end: '2024-12-31T13:30:00',
        },
      ],
    });
  }, []);

  return (
    <div className="main-content">
      <header>
        <h2>Schedule</h2>
      </header>
      <section className="calendar">
        <div id="calendar"></div>
      </section>
    </div>
  );
};

export default Schedule;