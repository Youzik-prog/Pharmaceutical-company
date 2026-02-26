import { Routes } from '@angular/router';
import { App } from './app';
import { TableComponent } from './components/table/table.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ChatComponent } from './components/chat/chat.component';

export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent },
    {path: 'tables', component: TableComponent },
    {path: 'chat', component: ChatComponent },
    {path: 'about', component: AboutComponent },
    {path: '**', redirectTo: 'home'} // TODO ЗАГЛУШКА
];
