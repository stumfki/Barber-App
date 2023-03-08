import { Component } from '@angular/core';
import { dataService } from '../data.service';

interface GiphyResponse {
  data: any[];
  pagination: any;
  meta: any;
}

@Component({
  selector: 'app-succes',
  templateUrl: './succes.component.html',
  styleUrls: ['./succes.component.sass'],
})
export class SuccesComponent {
  constructor(private giphyService: dataService) {}

  image: string = '';

  ngOnInit(): void {
    this.giphyService.getGifImage().subscribe((image) => {
      this.image = image;
    });
  }
}
