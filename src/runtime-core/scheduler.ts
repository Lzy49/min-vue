let queue = new Set<Function>();
let isFlushPending = false;
let p = Promise.resolve()
export function queueJobs(job) {
  queue.add(job)
  if (!isFlushPending) {
    isFlushPending = true;
    nextTick(() => {
      isFlushPending = false;
      Array.from(queue).forEach(element => element());
      queue.clear();
    });
  }
}
export function nextTick(fn) {
  return fn ? p.then(fn) : p
}