import {
    Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild, ElementRef
} from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs';
import { find } from 'lodash';
import { BaseComponent } from '../helpers/base.component';

const search = '.ui-select-search';
declare const $;

@Component({
  selector: 'dp-select',
  styleUrls: ['./dp-select.component.css'],
  template: `
    <ng-select
        #ngSelect
        [multiple]="multiple"
        [active]="activeItem"
        [items]="items"
        [disabled]="disabled"
        (typed)="typed($event)"
        (data)="_refreshValue($event)"
        (opened)="opened($event)"
        [placeholder]="placeholder"
        (selected)="itemSelect($event)"></ng-select>
  `
})

export class DpSelectComponent extends BaseComponent implements OnInit, OnChanges, OnDestroy {

  public activeItem = [{id: '', text: ''}];
  public searchValue: Subject<string> = new Subject<string>();
  public initialized;
  private _isOpened = false;
  @ViewChild('ngSelect') private ngSelect;
  @Input() public items;
  @Input() public active;
  @Input() public disabled = false;
  @Input() public multiple = false;
  @Input() public config = {key: 'id', value: 'text'};
  @Input() public remoteDataSource;
  @Input() public placeholder = '';

  @Output() public refreshValue: EventEmitter<any> = new EventEmitter();
  @Output() public selectItem: EventEmitter<any> = new EventEmitter();
  @Output() public search: EventEmitter<any> = new EventEmitter();
  @Output() public click: EventEmitter<any> = new EventEmitter();
  

  constructor(private _elementRef: ElementRef) {
    super();

    this.subs = this.searchValue
      .debounceTime(300) // wait 300ms after the last event before emitting last event
      .subscribe((text: any) => {
        this.subs = Observable.interval(0).take(1).subscribe(() => {
          // check real input value (ng-select doesn't return empty value)
          if (!$(this.ngSelect.element.nativeElement).find(search).val()) {
            this.search.emit('');
            return;
          }
          this.search.emit(text);
        });
      });
  }

  public ngOnInit() {
    let matchClick = this.ngSelect.matchClick;
    // extend method matchClick()
    this.ngSelect.matchClick = (event) => {
      matchClick.call(this.ngSelect, event);
      this.click.emit(event);
    }

    // copied piece from method open()
    this.ngSelect.updateOptions = function() {
      this.options = this.itemObjects
        .filter((option) => (this.multiple === false || this.multiple === true && !this.active.find((o) => option.text === o.text)));

      if (this.options.length > 0) {
        this.behavior.first();
      }
    }
  }

  public opened(event) {
    if (event) {
      this._elementRef.nativeElement.classList.add('open');
    } else {
      this._elementRef.nativeElement.classList.remove('open');
    }
  }

  public ngOnChanges(changes: SimpleChanges) {
    for (let paramName in changes) {
      if (changes.hasOwnProperty(paramName) && changes[paramName]) {
        switch (paramName) {
          case 'items':
            this.items = this.items.map((item) => {
              if (typeof item  === 'string') {
                return item;
              }

              return {
                id: item[this.config.key],
                text: item[this.config.value]
              }

            });

            if (this.remoteDataSource) {
              this.updateOptions();
            }
            break;
          case 'active':
            let sub = Observable.interval(250).subscribe(() => {
              if (this.multiple && Array.isArray(this.active)) {
                this.activeItem = this.active;
              } else {
                let currentItem = find(this.items, (item) => item.id === this.active);
                
                if (currentItem) {
                  this.activeItem = [currentItem];
                } else {
                  this.activeItem = [{id: this.active, text: this.active}];
                }
              }
              sub.unsubscribe();
            });
            break;
        }
      }
    }
  }

  public ngOnDestroy() {
    this.search.emit('');
  }

  public itemSelect(event) {
    this.selectItem.emit(event);
  }

  public itemRemove(event) {
  }

  public typed(event) {
    this.searchValue.next(event);
  }

  public _refreshValue(value) {
    this.refreshValue.emit(value);
  }
  
  private updateOptions() {
    this.subs = Observable.interval(0).take(1).subscribe(() => {
        if (this.initialized) {
          this.ngSelect.updateOptions();
        }
        this.initialized = true;
    });
  }

}
