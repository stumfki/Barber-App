import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { dataService } from '../data.service';
import { sloveneNumberValidator } from '../validators/slovene-number.validator';
import { time } from '../addTime.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass'],
})
export class HomeComponent implements OnInit {
  services: any[] = [];
  barbers: any[] = [];
  appointments: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dataServiceApi: dataService,
    private router: Router,
    private time: time
  ) {
    this.dataServiceApi.getServices().subscribe((data) => {
      for (let item of data) {
        this.services.push(item);
      }
    });

    this.dataServiceApi.getBarbers().subscribe((data) => {
      this.barbers = data;
    });

    this.dataServiceApi.getAppointments().subscribe((data) => {
      for (let appointment of data) {
        this.appointments.push(appointment);
      }
    });
  }

  form: FormGroup = new FormGroup({});

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contactNumber: ['', [Validators.required, sloveneNumberValidator]],
      barber: ['', Validators.required],
      service: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
    });

    this.form.controls['time'].disable();
    this.form.controls['date'].disable();

    this.form.controls['date'].valueChanges.subscribe((value) => {
      this.updateTimeControlState();
    });

    this.form.controls['service'].valueChanges.subscribe((value) => {
      this.updateTimeControlState();
      this.updateTimeControlStateDate();
    });

    this.form.controls['barber'].valueChanges.subscribe((value) => {
      this.updateTimeControlState();
      this.updateTimeControlStateDate();
    });
  }

  updateTimeControlState() {
    const date = this.form.controls['date'].value;
    const service = this.form.controls['service'].value;
    const barber = this.form.controls['barber'].value;

    if (date && service && barber) {
      this.form.controls['time'].enable();
    }
  }

  updateTimeControlStateDate() {
    const date = this.form.controls['date'].value;
    const service = this.form.controls['service'].value;
    const barber = this.form.controls['barber'].value;

    if (service && barber) {
      this.form.controls['date'].enable();
    }
  }

  selectedBarberStartHour: number = 0;
  selectedBarberEndHour: number = 0;
  selectedBarberBrakeStart: number = 0;
  selectedBarberBrakeDuration: number = 0;

  //Setting Date
  onDateChange(event: any) {
    const dayOfWeek = ((event.value.getDay() + 6) % 7) + 1;

    this.dataServiceApi.getBarbers().subscribe((data) => {
      const selectedBarber = this.form?.get('barber')?.value;

      this.selectedBarberStartHour =
        data[selectedBarber - 1].workHours[dayOfWeek - 1].startHour;
      this.selectedBarberBrakeStart =
        data[selectedBarber - 1].workHours[dayOfWeek - 1].lunchTime.startHour;
      this.selectedBarberBrakeDuration =
        data[selectedBarber - 1].workHours[
          dayOfWeek - 1
        ].lunchTime.durationMinutes;
      this.selectedBarberEndHour = Number(
        data[selectedBarber - 1].workHours[dayOfWeek - 1].endHour
      );
    });
  }

  times: any[] = [];
  reservedTimesBehind: any[] = [];

  getMinutesSinceMidnight(time: string): number {
    if (time === null || time === undefined) {
      return 0;
    }
    const [hours, minutes] = time.split(':');
    const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
    return totalMinutes;
  }

  onTimeChange() {
    const serviceSelected =
      this.form?.get('service')?.value === 1
        ? 4
        : this.form?.get('service')?.value === 2
        ? 6
        : this.form?.get('service')?.value === 3
        ? 10
        : 0;

    if (!this.form.controls['time'].disabled) {
      this.times = [];
      let timeCounter = this.selectedBarberStartHour;

      //Get starting hours
      for (
        let i = 0;
        i < Math.abs(this.selectedBarberStartHour - this.selectedBarberEndHour);
        i++
      ) {
        for (let j = 0; j < 60; j += 5) {
          let minutes = j.toString();

          if (j === 0) {
            minutes = '00';
          }

          if (j === 5) {
            minutes = '0' + 5;
          }

          let timeString =
            timeCounter.toString().padStart(2, '0') + ':' + minutes;
          this.times.push(timeString);
        }

        timeCounter++;
      }

      //Filter Brake
      let timeCounters = this.selectedBarberBrakeStart;
      let barberBrakeFilter: string[] = [];

      if (serviceSelected) {
        for (let j = 0; j < this.selectedBarberBrakeDuration; j += 5) {
          let minutes = j.toString();

          if (j === 0) {
            minutes = '00';
          }

          if (j === 5) {
            minutes = '0' + 5;
          }

          let timeString =
            timeCounters.toString().padStart(2, '0') + ':' + minutes;
          barberBrakeFilter.push(timeString);
        }

        timeCounters++;

        let removeTimeForOtherAppointments = this.times.splice(
          this.times.indexOf(barberBrakeFilter[0]) - serviceSelected + 1,
          serviceSelected
        );
        this.times = this.times.filter(
          (time) => !barberBrakeFilter.includes(time)
        );
      }

      //Filter other
      for (let i = 0; i < this.appointments.length; i++) {
        const startTime = this.appointments[i].startDate;
        const date = new Date(startTime * 1000);
        const formattedDate = date.toLocaleDateString('en-GB');

        const userDateValue = this.form?.get('date')?.value;
        const userDate = new Date(userDateValue);
        const formattedUserDate = userDate.toLocaleDateString('en-GB');

        const hours = date.getHours();
        const minutes = date.getMinutes();

        let filterBooked: string[] = [];

        if (
          formattedDate === formattedUserDate &&
          this.form.get('barber')?.value === this.appointments[i].barberId
        ) {
          if (serviceSelected) {
            // Iterate over the remaining 5-minute intervals
            let bookedCounters = hours;
            let startMinutes = minutes;

            const appointmentLength =
              this.appointments[i].serviceId === 1
                ? 4
                : this.appointments[i].serviceId === 2
                ? 6
                : this.appointments[i].serviceId === 3
                ? 10
                : 0;

            for (let k = 0; k < appointmentLength; k++) {
              let minutes = startMinutes.toString().padStart(2, '0');
              let hours = bookedCounters.toString().padStart(2, '0');

              let timeString = hours + ':' + minutes;

              filterBooked.push(timeString);

              startMinutes += 5;

              if (startMinutes >= 60) {
                startMinutes = 0;
                bookedCounters += 1;
              }
            }

            let bookedHoursBackwards = hours;
            let startMinutesBackwards = minutes;

            for (let k = 0; k < serviceSelected; k++) {
              let minutes = startMinutesBackwards.toString();

              if (startMinutesBackwards === 0) {
                minutes = '00';
              }

              if (startMinutesBackwards === 5) {
                minutes = '0' + 5;
              }

              let timeString =
                bookedHoursBackwards.toString().padStart(2, '0') +
                ':' +
                minutes;
              filterBooked.push(timeString);

              startMinutesBackwards -= 5;

              if (startMinutesBackwards < 0) {
                bookedHoursBackwards--;
                startMinutesBackwards = 55;
              }
            }

            this.reservedTimesBehind.push(
              filterBooked[filterBooked.length - 1]
            );

            this.times = this.times.filter(
              (time) => !filterBooked.includes(time)
            );
          }
        }
      }

      //Filter last options if no appointments
      if (
        this.times[this.times.length - 1] ===
        this.selectedBarberEndHour - 1 + ':55'
      ) {
        let removeTimeForOtherAppointments = this.times.splice(
          this.times.length - serviceSelected + 1,
          serviceSelected
        );
      }

      let reservedTimesBehindSubtracted = this.time.subtractTime(
        this.reservedTimesBehind
      );
      //Filter first options if there is a gap
      for (let i = 0; i < serviceSelected; i++) {
        if (
          this.getMinutesSinceMidnight(this.times[i]) -
            this.getMinutesSinceMidnight(this.times[i + 1]) !==
            -5 &&
          !reservedTimesBehindSubtracted.includes(this.times[i]) &&
          i > 1
        ) {
          let removeTimeForOtherAppointments = this.times.splice(0, i + 1);
          break;
        }
      }
    }
  }

  weekendsDatesFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    return day !== 0 && day !== 6;
  };

  price: string = 'Please select a service';

  onServiceChange(event: any) {
    const selectedServiceId = Number(event.value);

    for (let service of this.services) {
      if (selectedServiceId === service.id) {
        this.price =
          'Price is ' + this.services[selectedServiceId - 1].price + ' €';
      }
    }
  }

  //Submit

  submitted: boolean = false;
  formUnix = {};
  onSubmit() {
    if (this.form != null) {
      //Convert to unix
      const dateString = this.form.get('date')?.value;
      const timeString = this.form.get('time')?.value;
      const date = new Date(dateString);
      const [hours, minutes] = timeString.split(':');
      date.setHours(hours);
      date.setMinutes(minutes);
      const unixTimestamp = Math.floor(date.getTime() / 1000);

      const formData = {
        startDate: unixTimestamp,
        barberId: this.form.get('barber')?.value,
        serviceId: this.form.get('service')?.value,
      };
      this.formUnix = formData;
    }
    this.submitted = true;

    if (this.form.valid) {
      this.dataServiceApi.postData(this.formUnix).subscribe(
        (response) => {
          
          this.router.navigate(['/success']);
        },
        (error) => {
     
        }
      );
    }
  }
}
