import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { loadRemoteModule } from '@angular-architects/module-federation';

const routes: Routes = [
  { path: '', redirectTo: "home", pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'mfe1',
    loadChildren: () => {
      return loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4100/remoteEntry.js',
        exposedModule: './OrderModule'
      })
      .then((m) => {
        // console.log('Loaded remote module:', m);
        return m.OrderModule;
      })
      .catch(err => {
        console.error('Error loading remote module:', err);
        throw err;
      });
    }

  },
  { path: '**',  redirectTo: "home",   }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
