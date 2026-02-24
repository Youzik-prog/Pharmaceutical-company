import { DecimalPipe } from '@angular/common';
import { Component, computed, contentChild, ContentChild } from '@angular/core';
import { color } from 'chart.js/helpers';
import { COLOR_ACCENT, COLOR_ACCENT_2, COLOR_ACCENT_3 } from 'src/app/constants/colors';
import { DiagramCard, TotalValue, Values } from 'src/app/types/types';

@Component({
  selector: 'app-diagram-card',
  imports: [DecimalPipe],
  templateUrl: './diagram-card.component.html',
  styleUrl: './diagram-card.component.css',
})
export class DiagramCardComponent {

  child = contentChild.required(DiagramCard);
  
  title = computed<string>(() => this.child().title());

  totalValue = computed<TotalValue | undefined>(() => {
    const childInstance = this.child();

    const totalValue = childInstance.totalValue();

    if(!totalValue) return;


    const { currentValue, pastValue } = totalValue;

    return {
      currentValue,
      pastValue: pastValue ? (currentValue / pastValue) - 1 : undefined,
    };
  });

  values = computed<Values[]>(() => {

    const childInstance = this.child();

    const values = childInstance.values();

    if(!values) return [];

    const sum = values.reduce((acc, el) => acc + el.value, 0);

    return values.map(el => ({
      name: el.name,
      value: el.value / sum * 100,
      color: el.color,
    }))
  })

  showLastDays = computed<number>(() => this.child().showLastDays());

}
