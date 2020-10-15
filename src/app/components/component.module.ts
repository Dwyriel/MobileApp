import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PagHeaderComponent } from './pag-header/pag-header.component';

@NgModule({
    declarations: [PagHeaderComponent],
    exports: [PagHeaderComponent],
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule,
    ]
})
export class ComponentModule { }