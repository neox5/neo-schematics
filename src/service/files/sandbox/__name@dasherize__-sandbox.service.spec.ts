import { TestBed } from '@angular/core/testing';

import { <%= classify(name) %>SandboxService } from './<%= dasherize(name) %>-sandbox.service';

describe('<%= classify(name) %>SandboxService', () => {
  let service: <%= classify(name) %>SandboxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(<%= classify(name) %>SandboxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});