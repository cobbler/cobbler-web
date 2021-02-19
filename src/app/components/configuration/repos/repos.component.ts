import { Component, OnInit } from '@angular/core';
import { RepoService } from 'src/app/services/repo.service';

@Component({
  selector: 'app-repos',
  templateUrl: './repos.component.html',
  styleUrls: ['./repos.component.css']
})
export class ReposComponent implements OnInit {

  repos?: any[];

  constructor(private repoService: RepoService) { }

  ngOnInit(): void {
    this.getRepos();
  }

  getRepos() {
    this.repoService.getRepos().subscribe(repos => this.repos = repos);
  }
}
