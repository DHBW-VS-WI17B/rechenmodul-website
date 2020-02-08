export class Config {
    static readonly APP_VERSION: string = '0.0.0';
    static readonly THEME_PRIMARY_HEX_COLOR: string = '#3F51B5';
    static readonly THEME_SECONDARY_HEX_COLOR: string = '#E91E63';
    static readonly MAX_NUMBER_OF_DIFFERENT_POINT_VALUES: number = 30;
    static readonly MAX_SAMPLE_SIZE: number = 100;
    static readonly REGEX_POINT_VALUE_NUMBER: string = '^([+-]?)([0-9]+([,.][0-9]+)?)?$';
    static readonly REGEX_NUMBER: string = '^[0-9]+$';
}
