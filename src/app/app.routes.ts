import { Routes } from '@angular/router';
import { App } from './app';
import { TableComponent } from './components/table/table.component';

export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', component: App },
    {path: 'tables', component: TableComponent },
    {path: 'process', component: App },
    {path: 'documentation', component: App },
    {path: '**', redirectTo: 'home'} // TODO ЗАГЛУШКА
];
