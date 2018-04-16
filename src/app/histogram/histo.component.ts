import { Component, OnInit, DoCheck, ElementRef} from '@angular/core';
import { D3Service, D3, Selection } from 'd3-ng2-service';
import { DataService } from '../data.service';
import { ChartsService } from "../charts.service";

@Component({
  selector: 'histogram',
  templateUrl: './histo.component.html',
  styleUrls: ['./histo.component.css']
})

export class Histogram implements OnInit, DoCheck {

  private d3: D3;
  private parentNativeElement: any;
  private service: DataService;
  private charts: ChartsService;

  constructor(element: ElementRef,
              d3Service: D3Service,
              dataService: DataService,
              chartsService: ChartsService) {
    this.d3 = d3Service.getD3();
    this.parentNativeElement = element.nativeElement;
    this.service = dataService;
    this.data = [3, 12, 45, 67, 8];
    this.charts = chartsService;
  }

  getData(): void {
    this.service.getData().subscribe(x => {
      Promise.resolve(JSON.parse(x)).then(data => {
        this.data = data.map(el => {
          if (typeof el.caloriesPortionRatio !== "number") {
            return 1
          }
          return el.caloriesPortionRatio
        });

      })
    })

  }

  ngOnInit() {
    console.log('InitED');
    let d3 = this.d3;
    let d3ParentElement: Selection<any, any, any, any>;

    if (this.parentNativeElement !== null) {

      d3ParentElement = d3.select(this.parentNativeElement);
      let freqData=[
        {
          "Food": "Apples",
          "portionSize": 5.2,
          "pricePortionRatio": 0.36
        },
        {
          "Food": "Applesauce, jarred",
          "portionSize": 4.6,
          "pricePortionRatio": 0.22
        },
        {
          "Food": "Bananas",
          "portionSize": 4.1,
          "pricePortionRatio": 0.18
        },
        {
          "Food": "Cantaloupe",
          "portionSize": 3.5,
          "pricePortionRatio": 0.38
        },
        {
          "Food": "Fruit cocktail, canned*",
          "portionSize": 4.4,
          "pricePortionRatio": 0.31
        },
        {
          "Food": "Grapes",
          "portionSize": 3,
          "pricePortionRatio": 0.32
        }
      ];

      this.charts.getCharts(d3, freqData, d3ParentElement)

    }
  }


  ngDoCheck() {
  }
}
