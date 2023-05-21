export type AsyncPollPromiseResolve<T> = (value: T | PromiseLike<T>) => void;
export type AsyncPollPromiseReject = (reason?: unknown) => void;

/**
 * An async function that takes an async function as argument and runs
 * it until the result satisfies a check function.
 *
 * Inspired by the following gist:
 * https://gist.github.com/douglascayers/346e061fb7c1f38da00ee98c214464ae
 *
 * @typeParam T - The data type that will be eventually returned
 *
 * @param fn - The main async function to call repeatedly
 * @param checkFn - The function that takes the result of the main function to determine if polling should be stopped
 * @param pollInterval - Milliseconds to wait before attempting to resolve the promise again.
 * @param pollTimeout - Max time to keep polling to receive a successful resolved response.
 *
 * @returns A promise that will return either the desired result, an error, or timeout
 */
export async function asyncPoll<T>(
  /**
   * Function to call periodically until it resolves or rejects.
   *
   * It should resolve as soon as possible indicating if it found
   * what it was looking for or not. If not then it will be re-invoked
   * after the `pollInterval` if we haven't timed out.
   *
   * Rejections will stop the polling and be propagated.
   */
  fn: () => PromiseLike<T>,

  /**
   * The function to run on the returned data to determine if the main
   * async function has returned the desired result and polling can be
   * stopped.
   *
   * @param data - The data returned by the main async function of type T
   * @returns A boolean to determine if the async function has completed
   */
  checkFn: (data: T) => boolean,

  /**
   * Milliseconds to wait before attempting to resolve the promise again.
   * The promise won't be called concurrently. This is the wait period
   * after the promise has resolved/rejected before trying again for a
   * successful resolve so long as we haven't timed out.
   *
   * @defaultValue 5 seconds.
   */
  pollInterval: number = 5 * 1000,

  /**
   * Max time to keep polling to receive a successful resolved response.
   * If the promise never resolves before the timeout then this method
   * rejects with a timeout error.
   *
   * @defaultValue 30 seconds.
   */
  pollTimeout: number = 30 * 1000,
): Promise<T> {
  const endTime = new Date().getTime() + pollTimeout;
  const checkCondition = (
    resolve: AsyncPollPromiseResolve<T>,
    reject: AsyncPollPromiseReject,
  ): void => {
    Promise.resolve(fn())
      .then((result) => {
        const now = new Date().getTime();
        if (checkFn(result)) {
          resolve(result);
        } else if (now < endTime) {
          setTimeout(checkCondition, pollInterval, resolve, reject);
        } else {
          reject(new Error('AsyncPoller: reached timeout'));
        }
      })
      .catch((err) => {
        reject(err);
      });
  };
  return new Promise(checkCondition);
}
