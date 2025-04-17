import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  constructor() { }

  msg: string | null = null;

  ngOnInit(): void {
    window.addEventListener('message', (event) => {
      if (event.origin !== 'http://localhost:4000') return;
      if (event.data?.type === 'webpackOk') {
        return;
      }

      this.msg = event.data as string;
      console.log('Message from child:', this.msg);
    });


    if ((window as any)?.sharedSubject !== undefined) {
      (window as any)?.sharedSubject.next("Aloha, Child App");
    }
  }

  msgg = "Same to you, Child App"
  sendMessageToHost() {
    window.parent.postMessage(
      this.msgg,
      'http://localhost:4000/'
    )
  }
}
