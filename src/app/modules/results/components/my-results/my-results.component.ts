import { Component, OnInit } from '@angular/core';
import { Result } from '../../../../core/models/result.model';
import { AuthService } from '../../../../core/services/auth.service';
import { ResultsService } from '../../services/results.service';

@Component({
  selector: 'app-my-results',
  templateUrl: './my-results.component.html',
  styleUrls: ['./my-results.component.scss']
})
export class MyResultsComponent implements OnInit {
  results: Result[] = [];
  total = 0;
  page = 1;
  pageSize = 15;
  loading = false;

  constructor(private auth: AuthService, private resultsService: ResultsService) {}

  ngOnInit(): void {
    const user = this.auth.currentUser;
    if (user) this.loadResults(user.id);
  }

  loadResults(athleteId: string): void {
    this.loading = true;
    this.resultsService.getAthleteResults(athleteId, this.page, this.pageSize).subscribe({
      next: res => { this.results = res.data; this.total = res.total; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  onPageChange(p: number): void {
    this.page = p;
    this.loadResults(this.auth.currentUser!.id);
  }
}
