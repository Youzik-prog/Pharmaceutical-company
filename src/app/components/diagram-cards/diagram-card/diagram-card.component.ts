import { DecimalPipe } from '@angular/common';
import { Component, Input, input, Signal } from '@angular/core';

type Values = {name: string, value: number};
type TotalValue = {currentValue: number, pastValue?: number};

@Component({
  selector: 'app-diagram-card',
  imports: [DecimalPipe],
  templateUrl: './diagram-card.component.html',
  styleUrl: './diagram-card.component.css',
})
export class DiagramCardComponent {

  totalValue = input<TotalValue, TotalValue>(undefined, {
    transform: (value: TotalValue) => {
      if(value.pastValue) {
        return {currentValue: value.currentValue, pastValue: ((value.currentValue / value.pastValue) - 1) * 100}
      } else
        return value;
    }
  });

  values = input<Values[], Values[]>([], {
    transform: (rawValues: Values[]) => {

      const sum = rawValues.reduce((acc, value) => acc + value.value, 0);

      return rawValues.map(value => (
        {name: value.name, 
          value: value.value / sum * 100}));
    }
  });

}
