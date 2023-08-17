import { CommonModule } from '@angular/common';
import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, EventEmitter, Input, NgModule, Output, QueryList, TemplateRef, ViewEncapsulation } from '@angular/core';
import { PrimeTemplate, SharedModule } from 'avan-primeng/api';
import { ButtonModule } from 'avan-primeng/button';
import { TimesIcon } from 'avan-primeng/icons/times';

@Component({
    selector: 'p-inplaceDisplay',
    template: '<ng-content></ng-content>',
    host: {
        class: 'p-element'
    }
})
export class InplaceDisplay {}

@Component({
    selector: 'p-inplaceContent',
    template: '<ng-content></ng-content>',
    host: {
        class: 'p-element'
    }
})
export class InplaceContent {}

@Component({
    selector: 'p-inplace',
    template: `
        <div [ngClass]="{ 'p-inplace p-component': true, 'p-inplace-closable': closable }" [ngStyle]="style" [class]="styleClass">
            <div class="p-inplace-display" (click)="onActivateClick($event)" tabindex="0" (keydown)="onKeydown($event)" [ngClass]="{ 'p-disabled': disabled }" *ngIf="!active">
                <ng-content select="[pInplaceDisplay]"></ng-content>
                <ng-container *ngTemplateOutlet="displayTemplate"></ng-container>
            </div>
            <div class="p-inplace-content" *ngIf="active">
                <ng-content select="[pInplaceContent]"></ng-content>
                <ng-container *ngTemplateOutlet="contentTemplate"></ng-container>

                <ng-container *ngIf="closable">
                    <button *ngIf="icon" type="button" [icon]="icon" pButton (click)="onDeactivateClick($event)"></button>
                    <button *ngIf="!icon" type="button" pButton [ngClass]="'p-button-icon-only'" (click)="onDeactivateClick($event)">
                        <TimesIcon *ngIf="!closeIconTemplate" />
                        <ng-template *ngTemplateOutlet="closeIconTemplate"></ng-template>
                    </button>
                </ng-container>
            </div>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./inplace.css'],
    host: {
        class: 'p-element'
    }
})
export class Inplace implements AfterContentInit {
    /**
     * Whether the content is displayed or not.
     */
    @Input() active: boolean | undefined = false;
    /**
     * Displays a button to switch back to display mode.
     */
    @Input() closable: boolean | undefined = false;
    /**
     * When present, it specifies that the element should be disabled.
     */
    @Input() disabled: boolean | undefined = false;
    /**
     * Allows to prevent clicking.
     */
    @Input() preventClick: boolean | undefined;
    /**
     * Inline style of the element.
     */
    @Input() style: { [klass: string]: any } | null | undefined;
    /**
     * Class of the element.
     */
    @Input() styleClass: string | undefined;
    /**
     * Icon to display in the close button.
     */
    @Input() closeIcon: string | undefined;

    @ContentChildren(PrimeTemplate) templates: QueryList<any>;
    /**
     * Callback to invoke when inplace is opened.
     */
    @Output() onActivate: EventEmitter<Event> = new EventEmitter();
    /**
     * Callback to invoke when inplace is closed.
     */
    @Output() onDeactivate: EventEmitter<Event> = new EventEmitter();

    hover: boolean;

    displayTemplate: TemplateRef<any>;

    contentTemplate: TemplateRef<any>;

    closeIconTemplate: TemplateRef<any>;

    constructor(public cd: ChangeDetectorRef) {}

    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'display':
                    this.displayTemplate = item.template;
                    break;

                case 'closeicon':
                    this.closeIconTemplate = item.template;
                    break;

                case 'content':
                    this.contentTemplate = item.template;
                    break;
            }
        });
    }

    onActivateClick(event) {
        if (!this.preventClick) this.activate(event);
    }

    onDeactivateClick(event) {
        if (!this.preventClick) this.deactivate(event);
    }

    activate(event?: Event) {
        if (!this.disabled) {
            this.active = true;
            this.onActivate.emit(event);
            this.cd.markForCheck();
        }
    }

    deactivate(event?: Event) {
        if (!this.disabled) {
            this.active = false;
            this.hover = false;
            this.onDeactivate.emit(event);
            this.cd.markForCheck();
        }
    }

    onKeydown(event: KeyboardEvent) {
        if (event.which === 13) {
            this.activate(event);
            event.preventDefault();
        }
    }
}

@NgModule({
    imports: [CommonModule, ButtonModule, SharedModule, TimesIcon],
    exports: [Inplace, InplaceDisplay, InplaceContent, ButtonModule, SharedModule],
    declarations: [Inplace, InplaceDisplay, InplaceContent]
})
export class InplaceModule {}
