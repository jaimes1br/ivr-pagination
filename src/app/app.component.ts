import { Component, OnInit } from '@angular/core';
import { StoresService } from './perPage/services/stores.service';
@Component({
  selector: 'ivr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'ivr';

  constructor(private storesService: StoresService){}

  ngOnInit(): void {
    this.storesService.getAllPages().subscribe();
    
  }

}
