import { Directive, effect, ElementRef, input, OnChanges, Renderer2, Signal, signal, SimpleChanges } from '@angular/core';
import { Drug } from '../types/types';

type statusData = Drug['status'];
type statusConfig = {
  key: keyof statusData;
  color: string; 
}

@Directive({
  selector: '[appMultiProgress]',
  standalone: true
})
export class MultiProgressDirective {


  statuses = input.required<statusData>({ alias: 'appMultiProgress' });

  constructor(private element: ElementRef, private renderer: Renderer2) {
    effect(() => {
      this.renderSegments(this.statuses());
    })

    this.renderer.addClass(this.element.nativeElement, 'flex');
    this.renderer.addClass(this.element.nativeElement, 'gap-1');
   }

   private renderSegments(data: statusData) {
     this.element.nativeElement.innerHTML = '';

     const config: statusConfig[] = [
        {key: 'healthy', color: 'bg-accent'},
        {key: 'unhealthy', color: 'bg-fail'},
        {key: 'dangerous', color: 'bg-amber-600'},
        { key: 'noEffect', color: 'bg-success' }
      ];

      for(let item of config) {
        const width = data[item.key];
        if(width > 0) {
          const segment = this.renderer.createElement('div');
          this.renderer.addClass(segment, 'progress-bar');
          this.renderer.addClass(segment, 'h-full');
          this.renderer.addClass(segment, item.color);
          this.renderer.setStyle(segment, 'width', `${width}%`);
          this.renderer.appendChild(this.element.nativeElement, segment);
        }
      }
   }

}
