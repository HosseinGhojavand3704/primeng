import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'avan-primeng/inputtext';
import { InputTextareaModule } from 'avan-primeng/inputtextarea';
import { KeyFilterModule } from 'avan-primeng/keyfilter';
import { AppDocModule } from '../../layout/doc/app.doc.module';
import { AppCodeModule } from '../../layout/doc/code/app.code.component';
import { AccessibilityDoc } from './accessibilitydoc';
import { AutoResizeDoc } from './autoresizedoc';
import { BasicDoc } from './basicdoc';
import { DisabledDoc } from './disableddoc';
import { EventsDoc } from './eventsdoc';
import { FloatlabelDoc } from './floatlabeldoc';
import { ImportDoc } from './importdoc';
import { KeyfilterDoc } from './keyfilterdoc';
import { PropsDoc } from './propsdoc';
import { ReactiveFormsDoc } from './reactiveformsdoc';
import { StyleDoc } from './styledoc';

@NgModule({
    imports: [CommonModule, AppCodeModule, InputTextModule, FormsModule, ReactiveFormsModule, InputTextareaModule, AppDocModule, KeyFilterModule],
    exports: [AppDocModule],
    declarations: [ImportDoc, BasicDoc, AutoResizeDoc, FloatlabelDoc, DisabledDoc, KeyfilterDoc, PropsDoc, EventsDoc, StyleDoc, AccessibilityDoc, ReactiveFormsDoc]
})
export class InputtextareaDocModule {}
