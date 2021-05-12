import { TestBed } from '@angular/core/testing';

import { <%= classify(name) %>UtilService } from './<%= dasherize(name) %>-util.service';

describe('<%= classify(name) %>UtilService', () => {
  let service: <%= classify(name) %>UtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(<%= classify(name) %>UtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});