import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'avan-primeng/dialog';
import { ButtonModule } from 'avan-primeng/button';
import { TableModule } from 'avan-primeng/table';
import { ToastModule } from 'avan-primeng/toast';
import { AppDocModule } from '../../layout/doc/app.doc.module';
import { AppCodeModule } from '../../layout/doc/code/app.code.component';
import { OpenDoc } from './opendoc';
import { ImportDoc } from './importdoc';
import { PropsDoc } from './propsdoc';
import { StyleDoc } from './styledoc';
import { ProductListDemo } from './productlistdemo';
import { BasicDoc } from './basicdoc';
import { UsageDoc } from './usagedoc';
import { PassingDataDoc } from './passingdatadoc';
import { CloseDoc } from './closedoc';
import { ProductListDemoDoc } from './productlistdemodoc';
import { EventsDoc } from './eventsdoc';
import { TagModule } from 'avan-primeng/tag';

@NgModule({
    imports: [CommonModule, AppCodeModule, RouterModule, FormsModule, TagModule, DialogModule, ButtonModule, AppDocModule, ToastModule, TableModule],
    declarations: [OpenDoc, ImportDoc, PropsDoc, StyleDoc, BasicDoc, ProductListDemo, UsageDoc, PassingDataDoc, CloseDoc, ProductListDemoDoc, StyleDoc, EventsDoc],
    exports: [AppDocModule],
    entryComponents: [ProductListDemo]
})
export class DynamicDialogDocModule {}
