import { Provider } from '@src/Provider'
import { CacheStorageKey } from '@src/cache/CacheStorageKey'

/**
 * Represents a cache provider. Custom caching providers must implement it.
 * Some implementations may use remote cache, e.g. Redis, so all the methods are async.
 *
 * The cache storage structure is very similar to a regular database.
 * We use keyspace as the key to the "database", and CacheStorageKey as the key to the "table".
 *
 * Key spaces contain cache storages.
 * Cache storages contain the cache itself, for example, guilds, members, roles, etc., in the format key => value.
 *
 * There is a cache storage named global. It is used for global operation with all cache storages inside the key space.
 * When the cache provider receives a request with the `global` storage key,
 * it must perform the required operation on all the storages inside the key space.
 * BUT, if the provider receives a set request with the `global` storage key,
 * the provider must create a new storage with the `global` key and write the data there.
 *
 * The provider must create new cache storage when it receives a set request with a previously unknown cache storage key.
 * The same applies to key spaces.
 *
 * The provider must determine which cache storages are empty, and then delete them. The same applies to key spaces.
 *
 * The provider must give the cache in the form in which it stores it and not try to serialize it into classes.
 *
 * @see https://github.com/ddoodev/discordoo/blob/develop/src/cache/DefaultCacheProvider.ts
 */
export interface CacheProvider extends Provider {
  /**
   * This property indicates what the cache provider can work with.
   *
   * 'classes' means that the provider can store javascript classes directly,
   * without serializing them into objects or anything else.
   *
   * 'json' means that the provider can store information in json.
   * The library will send data to the provider in json format (objects without bigint and circular).
   *
   * 'text' means that the provider can store information in strings.
   * The library will translate classes into json, json into strings and send them to the provider.
   *
   * 'buffer' means that the provider can store information encoded in buffer.
   * The library will translate classes to json, json to buffer and send them to the provider.
   * */
  compatible: 'classes' | 'json' | 'text' | 'buffer'

  /**
   * All cache providers must has this property,
   * which indicates whether the provider uses shared cache between several shards.
   *
   * When `true`, the library will not request the cache from neighboring shards,
   * but will immediately request the cache from the provider. Example:
   *
   * developer wants check if X emoji exists in the cache on all shards --> library sends request to cache provider -->
   * cache provider replies --> library replies to developer
   *
   * When `false`, the library will try to find the cache on the shards specified by the developer. Example:
   *
   * developer wants check if X emoji exists in the cache on all shards --> library sends request to sharding manager -->
   * sharding manager sends request to all shards --> shards request cache from local cache providers -->
   * shards are replying --> sharding manager serializes replies -->
   * sharding manager sends reply to the shard from which the request came --> library replies to developer
   * */
  sharedCache: boolean

  /**
   * Get value from key
   * @param keyspace - keyspace in which to search
   * @param storage - storage in which to search
   * @param key - key to get value
   */
  get<K = string, V = any>(keyspace: string, storage: CacheStorageKey, key: K): Promise<V | undefined>

  /**
   * Set a key to given value
   * @param keyspace - keyspace in which to set
   * @param storage - storage in which to set
   * @param key - key to use
   * @param value - value to set
   */
  set<K = string, V = any>(keyspace: string, storage: CacheStorageKey, key: K, value: V): Promise<CacheProvider>

  /**
   * Delete a key from cache
   * @param keyspace - keyspace in which to delete
   * @param storage - storage in which to delete
   * @param key - key(s) of cache to delete
   */
  delete<K = string>(keyspace: string, storage: CacheStorageKey, key: K | K[]): Promise<boolean>

  /**
   * Execute a provided function once for each cache element
   * @param keyspace - keyspace in which to execute
   * @param storage - storage in which to execute
   * @param predicate - function to execute
   * */
  forEach<K = string, V = any, P extends CacheProvider = CacheProvider>(
    keyspace: string, storage: CacheStorageKey, predicate: (value: V, key: K, provider: P) => unknown | Promise<unknown>
  ): Promise<void>

  /**
   * Clear all cache from storage
   * @param keyspace - keyspace in which to clear
   * @param storage - storage in which to clear
   */
  clear?(keyspace: string, storage: CacheStorageKey): Promise<boolean>

  /**
   * Get size of cache in storage
   * @param keyspace - keyspace in which to search
   * @param storage - storage in which to search
   * */
  size?(keyspace: string, storage: CacheStorageKey): Promise<number>

  /**
   * Check if key exists in cache
   * @param keyspace - keyspace in which to search
   * @param storage - storage in which to search
   * @param key - key to check
   */
  has?<K = string>(keyspace: string, storage: CacheStorageKey, key: K): Promise<boolean>

  /**
   * Execute a provided function once for each cache element and then delete the elements that the function returned true for
   * @param keyspace - keyspace in which to execute
   * @param storage - storage in which to execute
   * @param predicate - function to execute
   * */
  sweep?<K = string, V = any, P extends CacheProvider = CacheProvider>(
    keyspace: string, storage: CacheStorageKey, predicate: (value: V, key: K, provider: P) => boolean | Promise<boolean>
  ): Promise<void>

  /**
   * Execute a provided function once for each cache element and then make array of elements that the function returned true for
   * @param keyspace - keyspace in which to execute
   * @param storage - storage in which to execute
   * @param predicate - function to execute
   * */
  filter?<K = string, V = any, P extends CacheProvider = CacheProvider>(
    keyspace: string, storage: CacheStorageKey, predicate: (value: V, key: K, provider: P) => boolean | Promise<boolean>
  ): Promise<Array<[ K, V ]>>

  /**
   * Creates a new array populated with the results of calling a provided function on every cache element
   * @param keyspace - keyspace in which to execute
   * @param storage - storage in which to execute
   * @param predicate - function to execute
   * */
  map?<K = string, V = any, R = any, P extends CacheProvider = CacheProvider>(
    keyspace: string, storage: CacheStorageKey, predicate: (value: V, key: K, provider: P) => R | Promise<R>
  ): Promise<R[]>

  /**
   * Execute a provided function once for each cache element and return element that the function returned true for
   * @param keyspace - keyspace in which to execute
   * @param storage - storage in which to execute
   * @param predicate - function to execute
   * */
  find?<K = string, V = any, P extends CacheProvider = CacheProvider>(
    keyspace: string, storage: CacheStorageKey, predicate: (value: V, key: K, provider: P) => boolean | Promise<boolean>
  ): Promise<V | undefined>

  /**
   * Execute a provided function once for each cache element and count the number of elements for which the function returned true
   * @param keyspace - keyspace in which to execute
   * @param storage - storage in which to execute
   * @param predicate - function to execute
   * */
  count?<K = string, V = any, P extends CacheProvider = CacheProvider>(
    keyspace: string, storage: CacheStorageKey,
    predicate: (value: V, key: K, provider: P) => boolean | Promise<boolean>
  ): Promise<number>

  /**
   * Execute a provided functions once for each cache element and count the number of elements for which the functions returned true.
   * The order of responses depends on the order of the passed functions.
   * Example:
   * ```js
   * cache.counts('members', '123456789123456789', [ (m) => m.presence.status === 'online', (m) => m.presence.status === 'idle' ])
   * // will return [ number, number ]. first number = online members, second = idle members.
   * ```
   * @param keyspace - keyspace in which to execute
   * @param storage - storage in which to execute
   * @param predicates - array of functions to execute
   * */
  counts?<K = string, V = any, P extends CacheProvider = CacheProvider>(
    keyspace: string, storage: CacheStorageKey,
    predicates: ((value: V, key: K, provider: P) => boolean | Promise<boolean>)[]
  ): Promise<number[]>

  /**
   * Extract keys from storage
   * @param keyspace - keyspace in which to extract
   * @param storage - storage in which to extract
   * */
  keys?<K = string>(keyspace: string, storage: CacheStorageKey): Promise<K[]>

  /**
   * Extract values from storage
   * @param keyspace - keyspace in which to extract
   * @param storage - storage in which to extract
   * */
  values?<V = any>(keyspace: string, storage: CacheStorageKey): Promise<V[]>

  /**
   * Extract keys and values from storage
   * @param keyspace - keyspace in which to extract
   * @param storage - storage in which to extract
   * */
  entries?<K = string, V = any>(keyspace: string, storage: CacheStorageKey): Promise<Array<[ K, V ]>>

}
