import { SafePipe } from './safeurl.pipe';

describe('SafePipe', () => {
  it('create an instance', () => {
    const pipe = new SafePipe();
    expect(pipe).toBeTruthy();
  });
});
