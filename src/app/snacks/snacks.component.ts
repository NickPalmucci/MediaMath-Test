import { Component, OnInit} from '@angular/core';
import { D3Service, D3 } from 'd3-ng2-service';
import { DataService } from '../data.service';
import { ChartsService } from '../charts.service';

@Component({
  selector: 'app-snacks',
  templateUrl: './snacks.component.html',
  styleUrls: ['./snacks.component.css']
})
export class SnacksComponent implements OnInit {

  private d3: D3;
  private charts: ChartsService;
  private data: any;
  private fruitData: any;

  constructor(d3Service: D3Service,
              dataService: DataService,
              chartsService: ChartsService) {
    this.d3 = d3Service.getD3();
    this.data = dataService.getData('/snacks');
    this.charts = chartsService;

  }

  loadCharts(): any {
    return this.data.subscribe((x: string) => {
      Promise.resolve(JSON.parse(x)).then(data => {
        this.fruitData = data;
        this.charts.getCharts(this.d3, this.fruitData);
      });
    });

  }

  ngOnInit() {
    this.loadCharts();
  }

}
