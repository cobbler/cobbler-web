import { Component, Input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'cobbler-help-button',
  standalone: true,
  imports: [MatIconButton, MatIcon, MatTooltip],
  templateUrl: './help-button.component.html',
})
export class HelpButtonComponent {
  @Input() hint?: string;
  private sticky = false;

  onMouseEnter(tooltip: MatTooltip): void {
    tooltip.show();
  }

  onMouseLeave(tooltip: MatTooltip): void {
    if (!this.sticky) {
      tooltip.hide();
    }
  }

  onClick(tooltip: MatTooltip): void {
    this.sticky = !this.sticky;
    if (this.sticky) {
      tooltip.show();
    } else {
      tooltip.hide();
    }
  }
}
