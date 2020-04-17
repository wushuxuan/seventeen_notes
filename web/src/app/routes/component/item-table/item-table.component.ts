import { Component, OnInit, Input, Output, EventEmitter, } from '@angular/core';

@Component({
  selector: 'app-item-table',
  templateUrl: './item-table.component.html',
  styles: []
})
export class ItemTableComponent implements OnInit {

  @Input() data: any;
  @Output() private outer = new EventEmitter<string>();
  constructor() { }

  ngOnInit() {
  }


  show(id) {
    this.outer.emit(JSON.stringify({ id: id, type: 'show' }))
  }


  delete(id) {
    this.outer.emit(JSON.stringify({ id: id, type: 'delete' }))
  }

}
