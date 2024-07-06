declare namespace browser {
  namespace storage.local {
    function get(keys?: any);

    function set(items: any);

    function remove(keys: any);
  }
  namespace runtime {
    function getURL(path: string): string;
  }
}
