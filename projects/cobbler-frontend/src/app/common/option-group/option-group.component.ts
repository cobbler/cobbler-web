import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

// Visually groups a set of related flat fields (Power, Virt, DNS, TFTP, URI, IP, APT, ...) under
// a single heading, so the shared prefix doesn't have to be repeated as a prefix on every one of
// their field labels. Purely a frontend display grouping — on Cobbler 3.3.x these are plain,
// individually-named attributes on the item, not a backend "Option" sub-object.
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
