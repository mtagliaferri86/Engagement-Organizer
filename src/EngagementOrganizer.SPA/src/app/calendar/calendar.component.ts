import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Day } from '../models/day';
import { CalendarDay } from '../models/calendarDay';
import { Appointment, AppointmentExtraInfo } from '../api/EngagementOrganizerApiClient';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { DateTimeUtils } from '../utils/dateTimeUtils';
import { Month } from '../models/month';
import { CalendarView } from '../models/calendarView';
import { CalendarDisplay } from '../models/calendarDisplay';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarComponent implements OnInit {
  readonly MaxTileYearView: number = 37;
  readonly MaxTileMonthView: number = 7;

  @Input()
  currentView: CalendarView = CalendarView.Year;


  @Input()
  selectedDisplay: CalendarDisplay = CalendarDisplay.Event;

  @Input()
  currentYear: number = new Date().getFullYear();

  @Input()
  currentMonthStartDate = DateTimeUtils.getNowWithoutTime();

  @Input()
  filterProject: string;

  @Input()
  upstreamEventToken: string;

  @Input()
  appointments: Array<AppointmentExtraInfo>;

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
  }

  @Output() daySelected = new EventEmitter<Date>();

  @Output() eventSelected = new EventEmitter<Appointment>();

  eventViewerEventSelected(app: Appointment) {
    this.eventSelected.emit(app);
  }

  dayClicked(currentDay: CalendarDay) {
    if (currentDay.date != null) {
      this.daySelected.emit(currentDay.date);
    }
  }

  getEventsByDate(date: Date): Array<Appointment> {
    var ris: Array<Appointment> = [];
    if (date != null) {
      ris = this.appointments.filter(x => new Date(x.startDate.toString()) <= date && new Date(x.endDate.toString()) >= date);
    }
    if (this.filterProject != null && this.filterProject.trim() != "") {
      ris = ris.filter(x => x.project != null && x.project.toLowerCase() == this.filterProject.toLowerCase());
    }
    return ris.sort((a, b) => (a.typeID > b.typeID) ? -1 : 1);
  }

  getXHeaders(): Array<Day> {
    var res = new Array<Day>();
    if (this.currentView == CalendarView.Year) {
      for (let index = 0; index < this.getMaxTile(); index++) {
        var currentDayIndex = index % DateTimeUtils.days.length;
        res.push(DateTimeUtils.days[currentDayIndex]);
      }
    } else if (this.currentView == CalendarView.Month) {
      for (let index = 0; index < DateTimeUtils.days.length; index++) {
        var currentDayIndex = index % DateTimeUtils.days.length;
        res.push(DateTimeUtils.days[currentDayIndex]);
      }
    }
    return res;
  }

  isToday = (someDate) => {
    const today = new Date()
    return someDate.getDate() == today.getDate() &&
      someDate.getMonth() == today.getMonth() &&
      someDate.getFullYear() == today.getFullYear()
  }

  getDayHighlightingClass(day: CalendarDay): String {
    if (day.date != null) {
      if (this.isToday(day.date)) {
        return 'today';
      }

      if (day.date.getDay() == 6)
        return 'highlight-saturday';
      else if (day.date.getDay() == 0)
        return 'highlight-sunday';
    } else {
      return 'no-day';
    }
  }

  getMonthUtilization(month, year) {
    var currentDaysInMonth = DateTimeUtils.getDaysInMonth(month, year);
    var workingDayCount = 0;
    var billableAppointmentCount = 0;
    for (let i = 1; i <= currentDaysInMonth; i++) {
      var currentDate = new Date(year, month - 1, i);
      var dayOfTheWeek = currentDate.getDay();
      if (dayOfTheWeek != 6 && dayOfTheWeek != 0) {
        workingDayCount++;
      }
      if (this.getEventsByDate(currentDate).filter(x => x.type.billable).length > 0) billableAppointmentCount++;
    }
    return (100 * billableAppointmentCount / workingDayCount).toFixed(0);
  }

  getCurrentDaysRangeInY(currentYvalue): { start: number, end: number } {
    if (this.currentView == CalendarView.Year) {
      return { start: 1, end: DateTimeUtils.getDaysInMonth(currentYvalue, this.currentYear) };
    } else if (this.currentView == CalendarView.Month) {
      return { start: 1, end: 7 };
    }
  }

  getCurrentDate(currentYvalue, currentDayNumber): Date {
    if (this.currentView == CalendarView.Year) {
      return new Date(this.currentYear, currentYvalue - 1, currentDayNumber);
    } else if (this.currentView == CalendarView.Month) {
      var referDate = DateTimeUtils.addDays(this.currentMonthStartDate, -DateTimeUtils.countDaysTo(this.currentMonthStartDate, 1, -1))
      return DateTimeUtils.addDays(referDate, (7 * (currentYvalue - 1) + (currentDayNumber - 1)))
    }
  }


  getMaxTile() {
    if (this.currentView == CalendarView.Year) {
      return this.MaxTileYearView;
    } else if (this.currentView == CalendarView.Month) {
      return this.MaxTileMonthView;
    }
  }

  getXValues(currentYvalue): Array<CalendarDay> {
    var res = new Array<CalendarDay>();
    var currentDaysInY = this.getCurrentDaysRangeInY(currentYvalue);
    for (let i = currentDaysInY.start; i <= currentDaysInY.end; i++) {
      var currentDate = this.getCurrentDate(currentYvalue, i);
      if (i == 1) {
        var startingDayOfTheWeek = currentDate.getDay();
        if (startingDayOfTheWeek != 1) {
          if (startingDayOfTheWeek < 1) startingDayOfTheWeek = 7 - startingDayOfTheWeek;
          for (let j = 0; j < startingDayOfTheWeek - 1; j++) {
            res.push({ index: res.length + 1 });
          }
        }
      }
      res.push({ date: currentDate, index: res.length + 1 });
      if (i == currentDaysInY.end) {
        var tileLeft = this.getMaxTile() - res.length;
        for (let k = 0; k < tileLeft; k++) {
          res.push({ index: res.length + 1 });
        }
      }
    }
    return res;
  }

  getYValues() {
    if (this.currentView == CalendarView.Year) {
      return DateTimeUtils.months.map(x => ({ value: x.monthNumber, description: x.monthDescription }));
    } else if (this.currentView == CalendarView.Month) {
      return [1, 2, 3, 4, 5].map(x => ({ value: x, description: x.toString() }));
    }
  }

  trackByDayItems(index: number, item: CalendarDay): Date {
    return item.date;
  }

  public isCurrentMonth(param): boolean {
    var today = new Date()
    return param.value == (today.getMonth() + 1) && this.currentYear == today.getFullYear();
  }

  public get calendarView(): typeof CalendarView {
    return CalendarView;
  }
}