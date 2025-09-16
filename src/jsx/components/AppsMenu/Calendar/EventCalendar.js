import React, { Component } from "react";
import { Col, Row, Card } from "react-bootstrap";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import Swal from "sweetalert2";
import "../../../../../src/css/calender.css"; // keep your path

class EventCalendar extends Component {
  state = {
    calendarEvents: [
      {
        title: "Atlanta Monster",
        start: new Date("2023-04-04 00:00"),
        id: "99999998",
      },
      {
        title: "Atlanta Monster",
        start: new Date("2023-04-14 00:00"),
        id: "99999997",
      },
      {
        title: "My Favorite Murder",
        start: new Date("2023-04-25 10:00"),
        id: "99999996",
      },
      {
        title: "My Favorite Murder",
        start: new Date("2023-05-01 10:00"),
        id: "99999995",
      },
      {
        title: "My Favorite Murder",
        start: new Date("2023-05-11 10:00"),
        id: "99999994",
      },
      {
        title: "My Favorite Murder",
        start: new Date("2023-05-20 12:00"),
        id: "99999993",
      },
      {
        title: "My Favorite Murder",
        start: new Date("2023-05-25 09:00"),
        id: "99999992",
      },
    ],
    events: [
      { title: "Event 1", id: "1" },
      { title: "Event 2", id: "2" },
      { title: "Event 3", id: "3" },
      { title: "Event 4", id: "4" },
      { title: "Event 5", id: "5" },
    ],
  };

  componentDidMount() {
    const draggableEl = document.getElementById("s-external-events");
    if (draggableEl) {
      new Draggable(draggableEl, {
        itemSelector: ".s-external-pill",
        eventData: (eventEl) => {
          const title = eventEl.getAttribute("title");
          const id = eventEl.getAttribute("data-id");
          return {
            title,
            id,
            // attach our red class to newly dropped events as well
            classNames: ["s-event-red"],
          };
        },
      });
    }
  }

  eventClick = (eventClick) => {
    const { event } = eventClick;
    Swal.fire({
      title: event.title,
      html: `
        <div class="s-table-responsive">
          <table class="s-table">
            <tbody>
              <tr><td>Title</td><td><strong>${event.title}</strong></td></tr>
              <tr><td>Start Time</td><td><strong>${event.start}</strong></td></tr>
            </tbody>
          </table>
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Remove Event",
      cancelButtonText: "Close",
    }).then((result) => {
      if (result.value) {
        event.remove();
        Swal.fire("Deleted!", "Your Event has been deleted.", "success");
      }
    });
  };

  render() {
    return (
      <div className="s-animated-fadeIn s-demo-app">
        <Row>
          <Col lg={3}>
            <Card className="s-card">
              <div className="s-card-header s-border-0 s-pb-0">
                <h4 className="s-text-black s-fs-20 s-mb-0">Events</h4>
              </div>
              <Card.Body>
                <div id="s-external-events">
                  {this.state.events.map((event) => (
                    <div
                      className="s-external-pill s-btn s-btn-block s-event-red s-mb-2"
                      title={event.title}
                      data-id={event.id}
                      key={event.id}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={9}>
            <Card className="s-card">
              <Card.Body>
                <div className="s-demo-app-calendar" id="s-mycalendartest">
                  <FullCalendar
                    initialView="dayGridMonth"
                    headerToolbar={{
                      left: "prev,next today",
                      center: "title",
                      right: "", // removed month/week/day/list buttons
                    }}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    editable={true}
                    droppable={true}
                    eventDurationEditable={false}
                    weekends={true}
                    events={this.state.calendarEvents}
                    eventClassNames={() => ["s-event-red"]}
                    eventClick={this.eventClick}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default EventCalendar;
