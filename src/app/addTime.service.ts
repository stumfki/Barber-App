import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class time {

  constructor() { }

   subtractTime(arr: string[]): string[] {
    const new_arr: string[] = [];
    for (let i = 0; i < arr.length; i++) {
      const [hours, minutes] = arr[i].split(':');   // split the time string into hours and minutes
      let newMinutes = parseInt(minutes) - 5;        // subtract 5 minutes from the minutes part
      let newHours = parseInt(hours);
      if (newMinutes < 0) {
        newHours -= 1;                               // subtract 1 hour and add 60 minutes to the minutes part
        newMinutes += 60;
      }
      const newTime = `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
      new_arr.push(newTime);
    }
    return new_arr;
  }

}

