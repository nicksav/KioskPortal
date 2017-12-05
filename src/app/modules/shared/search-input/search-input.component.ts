import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs/Subject';

// Observable operators
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { BaseComponent } from '../helpers/base.component';

@Component({
  selector: 'search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.css']
})
export class SearchInputComponent extends BaseComponent implements OnInit {
  @Input() public ngModel;
  @Output() public ngModelChange: EventEmitter<any> = new EventEmitter();
  private searchTerms = new Subject<any>();

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.subs = this.searchTerms
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(term => this.ngModelChange.emit(term));
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

}
