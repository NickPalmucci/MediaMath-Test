import { Component } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent  {

  private showFruit = true;
  private showSnacks = false;

  constructor() { }

  show(food) {
    this.showFruit = false;
    this.showSnacks = false;

    food === 'fruit' ? this.showFruit = true : this.showSnacks = true;
  }
}
