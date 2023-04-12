export interface Translation {
    startsWith?: string;
    contains?: string;
    notContains?: string;
    endsWith?: string;
    equals?: string;
    notEquals?: string;
    noFilter?: string;
    lt?: string;
    lte?: string;
    gt?: string;
    gte?: string;
    is?: string;
    isNot?: string;
    before?: string;
    after?: string;
    dateIs?: string;
    dateIsNot?: string;
    dateBefore?: string;
    dateAfter?: string;
    clear?: string;
    apply?: string;
    matchAll?: string;
    matchAny?: string;
    addRule?: string;
    removeRule?: string;
    accept?: string;
    reject?: string;
    choose?: string;
    upload?: string;
    cancel?: string;
    dayNames?: string[];
    dayNamesShort?: string[];
    dayNamesMin?: string[];
    monthNames?: string[];
    jalaliMonthNames?: string[];
    monthNamesShort?: string[];
    jalaliMonthNamesShort?: string[];
    dateFormat?: string;
    firstDayOfWeek?: number;
    jalaliFirstDayOfWeek?: number;
    today?: string;
    gregorianCalenderName?: string;
    jalaliCalenderName?: string;
    weekHeader?: string;
    weak?: string;
    medium?: string;
    strong?: string;
    passwordPrompt?: string;
    emptyMessage?: string;
    emptyFilterMessage?: string;
}
