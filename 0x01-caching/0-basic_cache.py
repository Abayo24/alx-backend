#!/usr/bin/env python3
"""
class BasicCache that inherits from BaseCaching and is a caching system
"""


from base_caching import BaseCaching

class BasicCache(BaseCaching):
    """
    inherits from BaseCaching and is a caching system
    """

    def put(self, key, item):
        """Adds an item to the cache"""
        if key is None or item is None:
            return
        self.cache_data[key] = item

    def get(self, key):
        """
        returns values linked to the key
        """
        if key is not None:
            return self.cache_data.get(key)
        return None
