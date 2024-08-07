import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SampleAuthComponent} from "./sample-auth/sample-auth.component";

const routes: Routes = [
  {
    path: '',
    component: SampleAuthComponent
  },
  {
    path: 'sample-auth',
    component: SampleAuthComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
