import { DecimalPipe } from '@angular/common';
import { AfterContentInit, AfterViewInit, Component, computed, ContentChild, Input, input, signal, Signal, WritableSignal } from '@angular/core';
import { COLOR_ACCENT, COLOR_ACCENT_2, COLOR_ACCENT_3 } from 'src/app/constants/colors';
import { DiagramCard, TotalValue, Values } from 'src/app/types/types';

@Component({
  selector: 'app-diagram-card',
  imports: [DecimalPipe],
  templateUrl: './diagram-card.component.html',
  styleUrl: './diagram-card.component.css',
})
export class DiagramCardComponent implements AfterContentInit {
  
  @ContentChild(DiagramCard) child!: DiagramCard; 
  
  title = computed<string>(() => this.child.title());

  totalValue = computed<TotalValue | undefined>(() => {
    if(!this.child || !this.child.totalValue) return;

    const totalValue = this.child.totalValue();

    return {
      currentValue: totalValue.currentValue,
      pastValue: totalValue.pastValue ? (totalValue.currentValue / totalValue.pastValue) - 1 : undefined, 
    }
  });

  values = computed<Values[] | undefined>(() => {

    if(!this.child || !this.child.values) return;
    
    const values = this.child.values();

    const sum = values.reduce((acc, el) => acc + el.value, 0);

    return values.map(el => ({
      name: el.name,
      value: el.value / sum * 100
    }))
  })
      
  ngAfterContentInit() {
    
  }

  valuesColors = [COLOR_ACCENT, COLOR_ACCENT_2, COLOR_ACCENT_3];

}
