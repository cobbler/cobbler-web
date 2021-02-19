import { Component, OnInit } from '@angular/core';
import { SnippetService } from 'src/app/services/snippet.service';

@Component({
  selector: 'app-snippets',
  templateUrl: './snippets.component.html',
  styleUrls: ['./snippets.component.css']
})
export class SnippetsComponent implements OnInit {

  snippets?: any[];

  constructor(private snippetService: SnippetService) { }

  ngOnInit(): void {
    this.getSnippets();
  }

  getSnippets() {
    this.snippetService.getSnippets().subscribe(snippets => this.snippets = snippets);
  }
}
