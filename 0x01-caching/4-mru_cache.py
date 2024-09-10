#!/usr/bin/env python3
"""MRU Caching System"""

from base_caching import BaseCaching


class LRUCache(BaseCaching):
    """caching system using MRU"""

    def __init__(self):
        """initializes the class with base init"""
        super().__init__()
        self.mru = []

    def put(self, key, item):
        """Adds an item in the cache using mru"""
        if key is None or item is None:
            return

        if key in self.cache_data:
            self.mru.remove(key)

        self.cache_data[key] = item
        self.mru.append(key)

        if len(self.cache_data) > BaseCaching.MAX_ITEMS:
            mru_key = self.mru.pop(-2)
            print(f"DISCARD: {mru_key}")
            del self.cache_data[mru_key]

    def get(self, key):
        """get an item from cache using the key"""
        if key is None or key not in self.cache_data:
            return

        self.mru.remove(key)
        self.mru.append(key)
        return self.cache_data[key]
