import { TestBed } from '@angular/core/testing';
import { ContingencyTableService } from './contingency-table.service';

describe('ContingencyTableService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: ContingencyTableService = TestBed.get(ContingencyTableService);
        expect(service).toBeTruthy();
    });
});
