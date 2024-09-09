#!/usr/bin/env python3
"""class FIFOCache that inherits from
BaseCaching and is a caching system
"""


from base_caching import BaseCaching


class FIFOCache(BaseCaching):
    """caching system"""

    def __init__(self):
        """initialize the class with base init"""
        super().__init__()
        self.fifo = []

    def put(self, key, item):
        """Add item to cache"""
        if key is None or item is None:
            return

        if key not in self.cache_data:
            self.fifo.append(key)

        self.cache_data[key] = item

        if len(self.cache_data) > BaseCaching.MAX_ITEMS:
            oldest_key = self.fifo.pop(0)
            del self.cache_data[oldest_key]
            print(f"DISCARD: {oldest_key}")

    def get(self, key):
        """gets an item from cache using the key"""
        if key is None or key not in self.cache_data:
            return None
        return self.cache_data.get(key)
