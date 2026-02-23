import { DecimalPipe } from '@angular/common';
import { Component, computed, contentChild, ContentChild } from '@angular/core';
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

    if(!childInstance.totalValue) return;

    const totalValue = childInstance.totalValue();

    return {
      currentValue: totalValue.currentValue,
      pastValue: totalValue.pastValue ? (totalValue.currentValue / totalValue.pastValue) - 1 : undefined, 
    }
  });

  values = computed<Values[] | undefined>(() => {

    const childInstance = this.child();

    if(!childInstance.values) return;
    
    const values = childInstance.values();

    const sum = values.reduce((acc, el) => acc + el.value, 0);

    return values.map(el => ({
      name: el.name,
      value: el.value / sum * 100
    }))
  })

  showLastDays = computed(() => this.child().showLastDays());

  valuesColors = [COLOR_ACCENT, COLOR_ACCENT_2, COLOR_ACCENT_3];

}
