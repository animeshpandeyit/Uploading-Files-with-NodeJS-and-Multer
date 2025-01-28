import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent {
  @Input() data: any[] = [];
  @Output() edit = new EventEmitter<any>();
  @Output() update = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  isEditInProgress = false;

  constructor() {}

  onEdit(item: any) {
    this.edit.emit(item); // Emit edit event
  }

  onUpdate(item: any) {
    this.update.emit(item); // Emit update event
  }

  onDelete(item: any) {
    this.delete.emit(item); // Emit delete event
  }
}
