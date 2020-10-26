import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapsPageRoutingModule } from './maps-routing.module';

import { MapsPage } from './maps.page';
import { ComponentModule } from 'src/app/components/component.module';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapsPageRoutingModule,
    ComponentModule,
    AgmCoreModule,
  ],
  declarations: [MapsPage]
})
export class MapsPageModule { }
