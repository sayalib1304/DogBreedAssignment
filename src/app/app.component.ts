import { Component } from '@angular/core';
import { DogBreedService } from './dog-breed.service';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'dogBreedApp';

  breeds: any[] = [];
  currentPage: number = 1;
  searchControl: FormControl = new FormControl();


constructor(private dogService:DogBreedService){}

ngOnInit() {
  this.loadBreeds();
  this.searchControl.valueChanges.pipe(
    debounceTime(250),
    distinctUntilChanged()
  ).subscribe(query => {
    if (query.length > 3) {
      this.searchBreeds(query);
    } else if (query.length === 0) {
      this.loadBreeds();
    }
  });
}

loadBreeds() {
  this.dogService.getBreeds(this.currentPage).subscribe(data => {
    this.breeds = data.results;
  });
}

searchBreeds(query: string) {
  this.dogService.searchBreeds(query).subscribe(data => {
    this.breeds = data.results;
  });
}

nextPage() {
  this.currentPage++;
  this.loadBreeds();
}

previousPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.loadBreeds();
  }
}
}
