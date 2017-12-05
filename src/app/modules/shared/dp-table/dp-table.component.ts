import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'dp-table',
  styleUrls: ['./dp-table.component.css'],
  templateUrl: './dp-table.component.html'
})

export class DpTableComponent implements OnInit, OnChanges {

  public currentPage = 1;
  public limit = 10;
  public rows = [];
  public defaultSettings = {
    actions: [],
    showActions: true,
    selectRow: false,
    tooltip: (item) => false,
    hideAction: (row, action) => false,
    disableAction: (row, action) => false
  };

  @Input() public page;
  @Input() public source;
  @Input() public settings;
  @Input() public collectionSize;

  @Output('selectRow') public selectRow: EventEmitter<any> = new EventEmitter();
  @Output('pageChange') public pageChange: EventEmitter<any> = new EventEmitter();
  @Output('actionClicked') public actionClicked: EventEmitter<any> = new EventEmitter();

  public get colCount() {
    return this.settings.columns.length + (+this.settings.showActions);
  }

  constructor() {
  }

  public ngOnInit() {
    this.settings = Object.assign({}, this.defaultSettings, this.settings);
  }

  public ngOnChanges(changes: SimpleChanges) {
    for (let paramName in changes) {
      if (changes.hasOwnProperty(paramName) && changes[paramName]) {
        let currentValue = changes[paramName]['currentValue'];
        if ('settings' === paramName) {
          this.settings = Object.assign({}, this.defaultSettings, this.settings);
        } else if ('page' === paramName) {
          this.currentPage = currentValue;
        } else if ('source' === paramName) {
          this.rows = currentValue;
        }
      }
    }
  }

  public onSelectRow(event) {
    if (!this.settings.selectRow) {
      return;
    }
    this.selectRow.emit(event);
    for (let index in this.source) {
      if (this.source.hasOwnProperty(index)) {
        this.source[index]['selected'] = this.source[index].id === event.id;
      }
    }
  }

  public onActionClick(event, row, action, isDisabled) {
    event.stopPropagation();
    if (isDisabled) {
      event.preventDefault();
      return;
    }
    this.actionClicked.emit({callback: action.callback, row: row});
  }

  public getStyle() {
    if (!this.rows.length || !this.settings.showActions) {
      return '0'
    }
    return 4 * this.settings.actions.length + 'rem';
  }

  public onPageChange(page) {
    if (!this.currentPage) {
      this.currentPage = page;
      return;
    }

    this.pageChange.emit({
      search: {limit: this.limit, offset: (page - 1) * this.limit}
    });
  }
}
