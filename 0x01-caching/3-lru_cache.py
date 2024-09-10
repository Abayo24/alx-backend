#!/usr/bin/env python3
"""LRU Caching System"""

from base_caching import BaseCaching


class LRUCache(BaseCaching):
    """caching system using LRU"""

    def __init__(self):
        """initializes the class with base init"""
        super().__init__()
        self.lru = []

    def put(self, key, item):
        """Adds an item in the cache using lru"""
        if key is None or item is None:
            return

        if key in self.cache_data:
            self.lru.remove(key)

        self.cache_data[key] = item
        self.lru.append(key)

        if len(self.cache_data) > BaseCaching.MAX_ITEMS:
            lru_key = self.lru.pop(0)
            print(f"DISCARD: {lru_key}")
            del self.cache_data[lru_key]

    def get(self, key):
        """get an item from cache using the key"""
        if key is None or key not in self.cache_data:
            return

        self.lru.remove(key)
        self.lru.append(key)
        return self.cache_data[key]
