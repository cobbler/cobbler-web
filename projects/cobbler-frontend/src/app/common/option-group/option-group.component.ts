import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

// Visually groups the fields belonging to one backend "ItemOption" (Power, Virt, DNS, TFTP, URI,
// IP, APT, ...) under a single heading, so the option's name doesn't have to be repeated as a
// prefix on every one of its field labels.
@Component({
  selector: 'cobbler-option-group',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './option-group.component.html',
  styleUrl: './option-group.component.scss',
})
export class OptionGroupComponent {
  @Input({ required: true }) label!: string;
}
