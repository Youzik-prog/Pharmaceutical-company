import { Routes } from '@angular/router';
import { App } from './app';

export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', component: App },
    {path: 'tables', component: App },
    {path: 'process', component: App },
    {path: 'documentation', component: App },
    {path: '**', redirectTo: 'home'} // TODO ЗАГЛУШКА
];
