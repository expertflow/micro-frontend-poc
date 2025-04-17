import { loadRemoteModule } from '@angular-architects/module-federation';
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'host-app';

  msgFrmChild: string | null = null;

  ngOnInit(): void {

    (window as any).sharedSubject = new BehaviorSubject<any>("Hiya! , Host App");

    window.addEventListener('message', (event) => {

      if (event.origin !== 'http://localhost:4000') return;

      if (event.data?.type === 'webpackOk') {
        return;
      }

      this.msgFrmChild = event.data as string;
      console.log('Message from child:', this.msgFrmChild);
    });


    (window as any).sharedSubject.subscribe((value: any) => {
      console.log('Got new value:', value);
    });
  }

  @ViewChild('placeholder', { read: ViewContainerRef })
  viewContainer!: ViewContainerRef;

  async load(): Promise<void> {
    const m = await loadRemoteModule({
      type: 'module',
      remoteEntry: 'http://localhost:4200/remoteEntry.js',
      exposedModule: './Component'
    })
    this.viewContainer.createComponent(m.AppComponent);
  }

  msg = "Hello, Host App"

  sendMessageToChild() {
    window.parent.postMessage(
      this.msg,
      'http://localhost:4000/'
    )
  }

}
