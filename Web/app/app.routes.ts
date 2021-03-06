﻿import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'tv', pathMatch: 'full' },
    { path: 'tv', loadChildren: './tv/tv.module' },
    { path: 'coder', loadChildren: './coder/coder.module' } //lazy-loading
];

export const appRoutingProviders: any[] = [

];

export const routing = RouterModule.forRoot(routes);