import { TestBed } from '@angular/core/testing';

import { <%= classify(name) %>ApiService } from './<%= dasherize(name) %>-api.service';

describe('<%= classify(name) %>ApiService', () => {
  let service: <%= classify(name) %>ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(<%= classify(name) %>ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});