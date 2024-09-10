#!/usr/bin/env python3
"""LFU Cache System"""

from base_caching import BaseCaching


class LFUCache(BaseCaching):
    """LFU Caching"""

    def __init__(self):
        """initializes LFUCaching class"""
        super().__init__()
        self.count = {}
        self.lfu = []

    def put(self, key, item):
        """Adds items to cache using lru"""
        if key is None or item is None:
            return

        if key in self.cache_data:
            self.cache_data[key] = item
            self.count[key] += 1
            self.lfu.remove(key)
            self.lfu.append(key)
        else:
            self.cache_data[key] = item
            self.count[key] = 1
            self.lfu.append(key)

        if len(self.cache_data) > BaseCaching.MAX_ITEMS:
            lfu = min(self.count.values())
            lfu_keys = [k for k, v in self.count.items() if v == lfu]

            if len(lfu_keys) > 1:
                for rkey in self.lfu:
                    if rkey in lfu_keys:
                        self.lfu.remove(rkey)
                        break
            else:
                rkey = lfu_keys[0]
                self.lfu.remove(rkey)

            del self.cache_data[rkey]
            del self.count[rkey]
            print(f"DISCARD: {rkey}")

    def get(self, key):
        """gets item by key using lfu"""
        if key is None or item is None:
            return None

        self.count[key] += 1
        self.lfu.remove(key)
        self.lfu.append(key)

        return self.cache_data[key]
