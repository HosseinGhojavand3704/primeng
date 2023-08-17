import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TabMenuModule } from 'avan-primeng/tabmenu';
import { ButtonModule } from 'avan-primeng/button';
import { RippleModule } from 'avan-primeng/ripple';
import { AppDocModule } from '../../layout/doc/app.doc.module';
import { AppCodeModule } from '../../layout/doc/code/app.code.component';
import { ActiveDoc } from './activedoc';
import { BasicDoc } from './basicdoc';
import { ControlledDoc } from './controlleddoc';
import { EventsDoc } from './eventsdoc';
import { ImportDoc } from './importdoc';
import { MenuItemDoc } from './menuitemdoc';
import { PropsDoc } from './propsdoc';
import { StyleDoc } from './styledoc';
import { ScrollableDoc } from './scrollabledoc';
import { TemplateDoc } from './templatedoc';
import { TemplatesDoc } from './templatesdoc';
import { AccessibilityDoc } from './accessibilitydoc';

@NgModule({
    imports: [CommonModule, AppCodeModule, RouterModule, TabMenuModule, ButtonModule, RippleModule, AppDocModule],
    declarations: [BasicDoc, TemplatesDoc, EventsDoc, ScrollableDoc, ImportDoc, MenuItemDoc, PropsDoc, StyleDoc, ControlledDoc, ActiveDoc, TemplateDoc, TemplatesDoc, AccessibilityDoc],
    exports: [AppDocModule]
})
export class TabMenuDocModule {}
