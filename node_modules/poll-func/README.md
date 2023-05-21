# async-poll

## Table of contents

### Functions

- [asyncPoll](#asyncpoll)

### Type aliases

- [AsyncPollPromiseReject](#asyncpollpromisereject)
- [AsyncPollPromiseResolve](#asyncpollpromiseresolve)

## Functions

### asyncPoll

▸ **asyncPoll**<`T`\>(`fn`, `checkFn`, `pollInterval?`, `pollTimeout?`): Promise<T\>

An async function that takes an async function as argument and runs
it until the result satisfies a check function.

Inspired by the following gist:
https://gist.github.com/douglascayers/346e061fb7c1f38da00ee98c214464ae

#### Type parameters

| Name | Description |
| :------ | :------ |
| `T` | The data type that will be eventually returned |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | Function | The main async function to call repeatedly |
| `checkFn` | Function | The function that takes the result of the main function to determine if polling should be stopped |
| `pollInterval` | number | Milliseconds to wait before attempting to resolve the promise again. |
| `pollTimeout` | number | Max time to keep polling to receive a successful resolved response. |

#### Returns

Promise<T\>

A promise that will return either the desired result, an error, or timeout

#### Defined in

index.ts:20

## Type aliases

### AsyncPollPromiseReject

Ƭ **AsyncPollPromiseReject**: Function

#### Type declaration

▸ (`reason?`): void

##### Parameters

| Name | Type |
| :------ | :------ |
| `reason?` | unknown |

##### Returns

void

#### Defined in

index.ts:2

___

### AsyncPollPromiseResolve

Ƭ **AsyncPollPromiseResolve**: Function

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

▸ (`value`): void

##### Parameters

| Name | Type |
| :------ | :------ |
| `value` | T \| PromiseLike<T\> |

##### Returns

void

#### Defined in

index.ts:1

