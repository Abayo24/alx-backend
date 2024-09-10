#!/usr/bin/python3
"""LIFO Caching System"""
from base_caching import BaseCaching


class LIFOCache(BaseCaching):
    """LIFO Caching class"""

    def __init__(self):
        """initializes class with base init"""
        super().__init__()
        self.lifo = []

    def put(self, key, item):
        """Adds item to cache"""
        if key is None or item is None:
            return

        if key not in self.cache_data:
            self.lifo.append(key)

        self.cache_data[key] = item

        if len(self.cache_data) > BaseCaching.MAX_ITEMS:
            newest_key = self.lifo.pop(-2)
            print(f"DISCARD: {newest_key}")
            del self.cache_data[newest_key]

    def get(self, key):
        """gets an item from cache using the key"""
        if key is None or key not in self.cache_data:
            return None
        return self.cache_data.get(key)
