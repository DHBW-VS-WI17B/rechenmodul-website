export class Config {
    static readonly APP_VERSION: string = '0.0.0';
    static readonly CONTINGENCY_TABLE_MAX_ROWS: number = 6;
    static readonly CONTINGENCY_TABLE_MAX_COLUMNS: number = 6;
    static readonly REGEX_POINT_VALUE_NUMBER: string = '^([+-]?)([0-9]+([,.][0-9]+)?)?$';
    static readonly REGEX_NUMBER: string = '^[0-9]+$';
}
