import { hasProperty } from '../utils/helpers';

export function getFileAPIsInfo(): string[] {
  const fileAPIs = [
    'FileReader',
    'FileList',
    'File',
    'FileSystemDirectoryHandle',
    'FileSystemFileHandle',
    'FileSystemHandle',
    'FileSystemWritableFileStream',
    'showOpenFilePicker',
    'showSaveFilePicker',
    'webkitRequestFileSystem',
    'webkitResolveLocalFileSystemURL',
  ] as const;

  return fileAPIs.filter((api) => hasProperty(window, api));
}
