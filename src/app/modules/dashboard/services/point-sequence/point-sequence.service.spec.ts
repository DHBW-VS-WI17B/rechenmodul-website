import { TestBed } from '@angular/core/testing';
import { PointSequenceService } from './point-sequence.service';

describe('PointSequenceService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: PointSequenceService = TestBed.get(PointSequenceService);
        expect(service).toBeTruthy();
    });
});
