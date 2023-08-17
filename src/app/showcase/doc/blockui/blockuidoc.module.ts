import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BlockUIModule } from 'avan-primeng/blockui';
import { ButtonModule } from 'avan-primeng/button';
import { PanelModule } from 'avan-primeng/panel';
import { AppDocModule } from '../../layout/doc/app.doc.module';
import { AppCodeModule } from '../../layout/doc/code/app.code.component';
import { AccessibilityDoc } from './accessibilitydoc';
import { BasicDoc } from './basicdoc';
import { DocumentDoc } from './documentdoc';
import { ImportDoc } from './importdoc';
import { PropsDoc } from './propsdoc';
import { StyleDoc } from './styledoc';

@NgModule({
    imports: [CommonModule, RouterModule, AppCodeModule, AppDocModule, PanelModule, ButtonModule, BlockUIModule],
    declarations: [ImportDoc, BasicDoc, DocumentDoc, StyleDoc, PropsDoc, AccessibilityDoc],
    exports: [AppDocModule]
})
export class BlockUIDocModule {}
