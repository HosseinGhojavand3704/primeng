import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, Inject, Input, NgModule, NgZone, OnDestroy, Output, PLATFORM_ID, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomHandler } from 'avan-primeng/dom';
import { Nullable, VoidListener } from 'avan-primeng/ts-helpers';
import { SliderChangeEvent, SliderSlideEndEvent } from './slider.interface';

export const SLIDER_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Slider),
    multi: true
};
/**
 * Slider is a component to provide input with a drag handle.
 * @group Components
 */
@Component({
    selector: 'p-slider',
    template: `
        <div
            [ngStyle]="style"
            [class]="styleClass"
            [ngClass]="{ 'p-slider p-component': true, 'p-disabled': disabled, 'p-slider-horizontal': orientation == 'horizontal', 'p-slider-vertical': orientation == 'vertical', 'p-slider-animate': animate }"
            (click)="onBarClick($event)"
        >
            <span
                *ngIf="range && orientation == 'horizontal'"
                class="p-slider-range"
                [ngStyle]="{ left: isLtr ? (offset !== null && offset !== undefined ? offset + '%' : handleValues[0] + '%') : null, right: isLtr ? null : (offset !== null && offset !== undefined ? offset + '%' : handleValues[0] + '%'), width: diff ? diff + '%' : handleValues[1] - handleValues[0] + '%' }"
            ></span>
            <span
                *ngIf="range && orientation == 'vertical'"
                class="p-slider-range"
                [ngStyle]="{ bottom: offset !== null && offset !== undefined ? offset + '%' : handleValues[0] + '%', height: diff ? diff + '%' : handleValues[1] - handleValues[0] + '%' }"
            ></span>
            <span *ngIf="!range && orientation == 'vertical'" class="p-slider-range" [ngStyle]="{ height: handleValue + '%' }"></span>
            <span *ngIf="!range && orientation == 'horizontal'" class="p-slider-range" [ngStyle]="{ width: handleValue + '%' }"></span>
            <span
                #sliderHandle
                *ngIf="!range"
                [attr.tabindex]="disabled ? null : tabindex"
                (keydown)="onHandleKeydown($event)"
                class="p-slider-handle"
                (mousedown)="onMouseDown($event)"
                (touchstart)="onTouchStart($event)"
                (touchmove)="onTouchMove($event)"
                (touchend)="onTouchEnd($event)"
                [style.transition]="dragging ? 'none' : null"
                [ngStyle]="{ left: orientation == 'horizontal' && isLtr ? handleValue + '%' : null,'right': orientation == 'horizontal' && !isLtr ? handleValue + '%' : null, bottom: orientation == 'vertical' ? handleValue + '%' : null }"
                [attr.aria-valuemin]="min"
                [attr.aria-valuenow]="value"
                [attr.aria-valuemax]="max"
                [attr.aria-labelledby]="ariaLabelledBy"
            ></span>
            <span
                #sliderHandleStart
                *ngIf="range"
                [attr.tabindex]="disabled ? null : tabindex"
                (keydown)="onHandleKeydown($event, 0)"
                (mousedown)="onMouseDown($event, 0)"
                (touchstart)="onTouchStart($event, 0)"
                (touchmove)="onTouchMove($event, 0)"
                (touchend)="onTouchEnd($event)"
                [style.transition]="dragging ? 'none' : null"
                class="p-slider-handle"
                [ngStyle]="{ left: isLtr ? rangeStartLeft : null, 'right': isLtr ? null : rangeStartLeft, bottom: rangeStartBottom }"
                [ngClass]="{ 'p-slider-handle-active': handleIndex == 0 }"
                [attr.aria-valuemin]="min"
                [attr.aria-valuenow]="value ? value[0] : null"
                [attr.aria-valuemax]="max"
                [attr.aria-labelledby]="ariaLabelledBy"
            ></span>
            <span
                #sliderHandleEnd
                *ngIf="range"
                [attr.tabindex]="disabled ? null : tabindex"
                (keydown)="onHandleKeydown($event, 1)"
                (mousedown)="onMouseDown($event, 1)"
                (touchstart)="onTouchStart($event, 1)"
                (touchmove)="onTouchMove($event, 1)"
                (touchend)="onTouchEnd($event)"
                [style.transition]="dragging ? 'none' : null"
                class="p-slider-handle"
                [ngStyle]="{ left: isLtr ? rangeEndLeft : null, 'right': isLtr ? null : rangeEndLeft, bottom: rangeEndBottom }"
                [ngClass]="{ 'p-slider-handle-active': handleIndex == 1 }"
                [attr.aria-valuemin]="min"
                [attr.aria-valuenow]="value ? value[1] : null"
                [attr.aria-valuemax]="max"
                [attr.aria-labelledby]="ariaLabelledBy"
            ></span>
        </div>
    `,
    providers: [SLIDER_VALUE_ACCESSOR],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./slider.css'],
    host: {
        class: 'p-element'
    }
})
export class Slider implements OnDestroy, ControlValueAccessor {
    /**
     * When enabled, displays an animation on click of the slider bar.
     * @group Props
     */
    @Input() animate: boolean | undefined;
    /**
     * When present, it specifies that the element should be disabled.
     * @group Props
     */
    @Input() disabled: boolean | undefined;
    /**
     * Mininum boundary value.
     * @group Props
     */
    @Input() min: number = 0;
    /**
     * Maximum boundary value.
     * @group Props
     */
    @Input() max: number = 100;
    /**
     * Orientation of the slider.
     * @group Props
     */
    @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
    /**
     * Step factor to increment/decrement the value.
     * @group Props
     */
    @Input() step: number | undefined;
    /**
     * When specified, allows two boundary values to be picked.
     * @group Props
     */
    @Input() range: boolean | undefined;
    /**
     * Inline style of the component.
     * @group Props
     */
    @Input() style: { [klass: string]: any } | null | undefined;
    /**
     * Style class of the component.
     * @group Props
     */
    @Input() styleClass: string | undefined;
    /**
     * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
     * @group Props
     */
    @Input() ariaLabelledBy: string | undefined;
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    @Input() tabindex: number = 0;
    /**
     * Callback to invoke on value change.
     * @param {SliderChangeEvent} event - Custom value change event.
     * @group Emits
     */
    @Output() onChange: EventEmitter<SliderChangeEvent> = new EventEmitter<SliderChangeEvent>();
    /**
     * Callback to invoke when slide ended.
     * @param {SliderSlideEndEvent} event - Custom slide end event.
     * @group Emits
     */
    @Output() onSlideEnd: EventEmitter<SliderSlideEndEvent> = new EventEmitter<SliderSlideEndEvent>();

    @ViewChild('sliderHandle') sliderHandle: Nullable<ElementRef>;

    @ViewChild('sliderHandleStart') sliderHandleStart: Nullable<ElementRef>;

    @ViewChild('sliderHandleEnd') sliderHandleEnd: Nullable<ElementRef>;

    public value: Nullable<number>;

    public values: Nullable<number[]>;

    public handleValue: Nullable<number>;

    public handleValues: number[] = [];

    diff: Nullable<number>;

    offset: Nullable<number>;

    bottom: Nullable<number>;

    public onModelChange: Function = () => {};

    public onModelTouched: Function = () => {};

    public dragging: Nullable<boolean>;

    public dragListener: VoidListener;

    public mouseupListener: VoidListener;

    public initX: Nullable<number>;

    public initY: Nullable<number>;

    public barWidth: Nullable<number>;

    public barHeight: Nullable<number>;

    public sliderHandleClick: Nullable<boolean>;

    public handleIndex: number = 0;

    public startHandleValue: any;

    public startx: Nullable<number>;

    public starty: Nullable<number>;

    constructor(@Inject(DOCUMENT) private document: Document, @Inject(PLATFORM_ID) private platformId: any, public el: ElementRef, public renderer: Renderer2, private ngZone: NgZone, public cd: ChangeDetectorRef) {}

    get isLtr() {
        return DomHandler.isLTR(this.el.nativeElement);
    }

    onMouseDown(event: Event, index?: number) {
        if (this.disabled) {
            return;
        }

        this.dragging = true;
        this.updateDomData();
        this.sliderHandleClick = true;
        if (this.range && this.handleValues && this.handleValues[0] === this.max) {
            this.handleIndex = 0;
        } else {
            (this.handleIndex as any) = index;
        }

        this.bindDragListeners();
        (event.target as HTMLInputElement).focus();
        event.preventDefault();

        if (this.animate) {
            DomHandler.removeClass(this.el.nativeElement.children[0], 'p-slider-animate');
        }
    }

    onTouchStart(event: TouchEvent, index?: number) {
        if (this.disabled) {
            return;
        }

        var touchobj = event.changedTouches[0];
        this.startHandleValue = this.range ? this.handleValues[index as number] : this.handleValue;
        this.dragging = true;
        if (this.range && this.handleValues && this.handleValues[0] === this.max) {
            this.handleIndex = 0;
        } else {
            this.handleIndex = index as number;
        }

        if (this.orientation === 'horizontal') {
            this.startx = parseInt((touchobj as any).clientX, 10);
            this.barWidth = this.el.nativeElement.children[0].offsetWidth;
        } else {
            this.starty = parseInt((touchobj as any).clientY, 10);
            this.barHeight = this.el.nativeElement.children[0].offsetHeight;
        }

        if (this.animate) {
            DomHandler.removeClass(this.el.nativeElement.children[0], 'p-slider-animate');
        }

        event.preventDefault();
    }

    onTouchMove(event: TouchEvent) {
        if (this.disabled) {
            return;
        }

        var touchobj = event.changedTouches[0],
            handleValue = 0;

        if (this.orientation === 'horizontal') {
            if (this.isLtr) {
                handleValue = Math.floor(((parseInt((touchobj as any).clientX, 10) - (this.startx as number)) * 100) / (this.barWidth as number)) + this.startHandleValue;
            } else {
                handleValue = this.startHandleValue - Math.floor(((parseInt((touchobj as any).clientX, 10) - (this.startx as number)) * 100) / (this.barWidth as number));
            }
        } else {
            handleValue = Math.floor((((this.starty as number) - parseInt((touchobj as any).clientY, 10)) * 100) / (this.barHeight as number)) + this.startHandleValue;
        }

        this.setValueFromHandle(event, handleValue);

        event.preventDefault();
    }

    onTouchEnd(event: TouchEvent) {
        if (this.disabled) {
            return;
        }

        this.dragging = false;

        if (this.range) this.onSlideEnd.emit({ originalEvent: event, values: this.values as number[] });
        else this.onSlideEnd.emit({ originalEvent: event, value: this.value as number });

        if (this.animate) {
            DomHandler.addClass(this.el.nativeElement.children[0], 'p-slider-animate');
        }

        event.preventDefault();
    }

    onBarClick(event: Event) {
        if (this.disabled) {
            return;
        }

        if (!this.sliderHandleClick) {
            this.updateDomData();
            this.handleChange(event);
        }

        this.sliderHandleClick = false;
    }

    onHandleKeydown(event: KeyboardEvent, handleIndex?: number) {
        if (this.disabled) {
            return;
        }
        if (event.which == 38 || event.which == 39) {
            this.spin(event, 1, handleIndex);
        } else if (event.which == 37 || event.which == 40) {
            this.spin(event, -1, handleIndex);
        }
    }

    spin(event: Event, dir: number, handleIndex?: number) {
        let step = (this.step || 1) * dir;

        if (this.range) {
            this.handleIndex = handleIndex as number;
            this.updateValue((this.values as number[])[this.handleIndex] + step);
            this.updateHandleValue();
        } else {
            this.updateValue((this.value as number) + step);
            this.updateHandleValue();
        }

        event.preventDefault();
    }

    handleChange(event: Event) {
        let handleValue = this.calculateHandleValue(event);
        this.setValueFromHandle(event, handleValue);
    }

    bindDragListeners() {
        if (isPlatformBrowser(this.platformId)) {
            this.ngZone.runOutsideAngular(() => {
                const documentTarget: any = this.el ? this.el.nativeElement.ownerDocument : this.document;

                if (!this.dragListener) {
                    this.dragListener = this.renderer.listen(documentTarget, 'mousemove', (event) => {
                        if (this.dragging) {
                            this.ngZone.run(() => {
                                this.handleChange(event);
                            });
                        }
                    });
                }

                if (!this.mouseupListener) {
                    this.mouseupListener = this.renderer.listen(documentTarget, 'mouseup', (event) => {
                        if (this.dragging) {
                            this.dragging = false;
                            this.ngZone.run(() => {
                                if (this.range) this.onSlideEnd.emit({ originalEvent: event, values: this.values as number[] });
                                else this.onSlideEnd.emit({ originalEvent: event, value: this.value as number });

                                if (this.animate) {
                                    DomHandler.addClass(this.el.nativeElement.children[0], 'p-slider-animate');
                                }
                            });
                        }
                    });
                }
            });
        }
    }

    unbindDragListeners() {
        if (this.dragListener) {
            this.dragListener();
            this.dragListener = null;
        }

        if (this.mouseupListener) {
            this.mouseupListener();
            this.mouseupListener = null;
        }
    }

    setValueFromHandle(event: Event, handleValue: any) {
        this.sliderHandleClick = false;
        let newValue = this.getValueFromHandle(handleValue);

        if (this.range) {
            if (this.step) {
                this.handleStepChange(newValue, (this.values as any)[this.handleIndex]);
            } else {
                this.handleValues[this.handleIndex] = handleValue;
                this.updateValue(newValue, event);
            }
        } else {
            if (this.step) {
                this.handleStepChange(newValue, this.value as any);
            } else {
                this.handleValue = handleValue;
                this.updateValue(newValue, event);
            }
        }

        this.cd.markForCheck();
    }

    handleStepChange(newValue: number, oldValue: number) {
        let diff = newValue - oldValue;
        let val = oldValue;
        let _step = this.step as number;

        if (diff < 0) {
            val = oldValue + Math.ceil(newValue / _step - oldValue / _step) * _step;
        } else if (diff > 0) {
            val = oldValue + Math.floor(newValue / _step - oldValue / _step) * _step;
        }

        this.updateValue(val);
        this.updateHandleValue();
    }

    writeValue(value: any): void {
        if (this.range) this.values = value || [0, 0];
        else this.value = value || 0;

        this.updateHandleValue();
        this.updateDiffAndOffset();
        this.cd.markForCheck();
    }

    registerOnChange(fn: Function): void {
        this.onModelChange = fn;
    }

    registerOnTouched(fn: Function): void {
        this.onModelTouched = fn;
    }

    setDisabledState(val: boolean): void {
        this.disabled = val;
        this.cd.markForCheck();
    }

    get rangeStartLeft() {
        if (!this.isVertical()) return this.handleValues[0] > 100 ? 100 + '%' : this.handleValues[0] + '%';
        return null;
    }

    get rangeStartBottom() {
        return this.isVertical() ? this.handleValues[0] + '%' : 'auto';
    }

    get rangeEndLeft() {
        return this.isVertical() ? null : this.handleValues[1] + '%';
    }

    get rangeEndBottom() {
        return this.isVertical() ? this.handleValues[1] + '%' : 'auto';
    }

    isVertical(): boolean {
        return this.orientation === 'vertical';
    }

    updateDomData(): void {
        let rect = this.el.nativeElement.children[0].getBoundingClientRect();
        this.initX = rect.left + DomHandler.getWindowScrollLeft();
        this.initY = rect.top + DomHandler.getWindowScrollTop();
        this.barWidth = this.el.nativeElement.children[0].offsetWidth;
        this.barHeight = this.el.nativeElement.children[0].offsetHeight;
    }

    calculateHandleValue(event: Event): number {
        if (this.orientation === 'horizontal')
            if (this.isLtr) return (((event as MouseEvent).pageX - (this.initX as number)) * 100) / (this.barWidth as number);
            else return ((this.barWidth as number) + (this.initX as number) - (event as MouseEvent).pageX) * 100 / (this.barWidth as number);
        else return (((this.initY as number) + (this.barHeight as number) - (event as MouseEvent).pageY) * 100) / (this.barHeight as number);
    }

    updateHandleValue(): void {
        if (this.range) {
            this.handleValues[0] = (((this.values as number[])[0] < this.min ? 0 : (this.values as number[])[0] - this.min) * 100) / (this.max - this.min);
            this.handleValues[1] = (((this.values as number[])[1] > this.max ? 100 : (this.values as number[])[1] - this.min) * 100) / (this.max - this.min);
        } else {
            if ((this.value as number) < this.min) this.handleValue = 0;
            else if ((this.value as number) > this.max) this.handleValue = 100;
            else this.handleValue = (((this.value as number) - this.min) * 100) / (this.max - this.min);
        }

        if (this.step) {
            this.updateDiffAndOffset();
        }
    }

    updateDiffAndOffset(): void {
        this.diff = this.getDiff();
        this.offset = this.getOffset();
    }

    getDiff(): number {
        return Math.abs(this.handleValues[0] - this.handleValues[1]);
    }

    getOffset(): number {
        return Math.min(this.handleValues[0], this.handleValues[1]);
    }

    updateValue(val: number, event?: Event): void {
        if (this.range) {
            let value = val;

            if (this.handleIndex == 0) {
                if (value < this.min) {
                    value = this.min;
                    this.handleValues[0] = 0;
                } else if (value > (this.values as number[])[1]) {
                    if (value > this.max) {
                        value = this.max;
                        this.handleValues[0] = 100;
                    }
                }
                this.sliderHandleStart?.nativeElement.focus();
            } else {
                if (value > this.max) {
                    value = this.max;
                    this.handleValues[1] = 100;
                    this.offset = this.handleValues[1];
                } else if (value < this.min) {
                    value = this.min;
                    this.handleValues[1] = 0;
                } else if (value < (this.values as number[])[0]) {
                    this.offset = this.handleValues[1];
                }
                this.sliderHandleEnd?.nativeElement.focus();
            }

            if (this.step) {
                this.updateHandleValue();
            } else {
                this.updateDiffAndOffset();
            }

            (this.values as number[])[this.handleIndex] = this.getNormalizedValue(value);
            let newValues = [this.minVal, this.maxVal];
            this.onModelChange(newValues);
            this.onChange.emit({ event: event as Event, values: this.values as number[] });
        } else {
            if (val < this.min) {
                val = this.min;
                this.handleValue = 0;
            } else if (val > this.max) {
                val = this.max;
                this.handleValue = 100;
            }

            this.value = this.getNormalizedValue(val);

            this.onModelChange(this.value);
            this.onChange.emit({ event: event as Event, value: this.value });
            this.sliderHandle?.nativeElement.focus();
        }
    }

    getValueFromHandle(handleValue: number): number {
        return (this.max - this.min) * (handleValue / 100) + this.min;
    }

    getDecimalsCount(value: number): number {
        if (value && Math.floor(value) !== value) return value.toString().split('.')[1].length || 0;
        return 0;
    }

    getNormalizedValue(val: number): number {
        let decimalsCount = this.getDecimalsCount(this.step as number);
        if (decimalsCount > 0) {
            return +parseFloat(val.toString()).toFixed(decimalsCount);
        } else {
            return Math.floor(val);
        }
    }

    ngOnDestroy() {
        this.unbindDragListeners();
    }

    get minVal() {
        return Math.min((this.values as number[])[1], (this.values as number[])[0]);
    }
    get maxVal() {
        return Math.max((this.values as number[])[1], (this.values as number[])[0]);
    }
}

@NgModule({
    imports: [CommonModule],
    exports: [Slider],
    declarations: [Slider]
})
export class SliderModule {}
