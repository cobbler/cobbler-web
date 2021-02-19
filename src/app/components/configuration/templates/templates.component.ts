import { Component, OnInit } from '@angular/core';
import { TemplateService } from 'src/app/services/template.service';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css']
})
export class TemplatesComponent implements OnInit {

  templates?: any[];

  constructor(private templateService: TemplateService) { }

  ngOnInit(): void {
    this.getTemplates();
  }

  getTemplates() {
    this.templateService.getTemplates().subscribe(templates => this.templates = templates);
  }
}
