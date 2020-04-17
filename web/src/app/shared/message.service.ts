import { Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private modalService: NzModalService) { }

  info(content): void {
    this.modalService.info({
      nzTitle: 'Tips',
      nzContent: `<p>${content}</p>`,
    });
  }

  success(content): void {
    this.modalService.success({
      nzTitle: 'Tips',
      nzContent: `<p>${content}</p>`,
    });
  }

  error(content): void {
    this.modalService.error({
      nzTitle: 'Tips',
      nzContent: `<p>${content}</p>`,
    });
  }

  warning(content): void {
    this.modalService.warning({
      nzTitle: 'Tips',
      nzContent: `<p>${content}</p>`,
    });
  }
}
