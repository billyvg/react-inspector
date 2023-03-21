import { FC } from 'react';

export type Data = any;
export type DataIterator = (data: Data) => IterableIterator<any>;
export type OnExpandCallback = (path: string, expandedPaths: Record<string, boolean>) => void;

export interface TreeViewProps {
  name: string;
  data: Data | undefined;
  dataIterator: DataIterator;
  expandLevel?: number;
  expandPaths?: string | string[];
  path?: string;
  onExpand?: OnExpandCallback;
  nodeRenderer?: NodeRendererType;
}

export type ConnectedTreeNodeProps = Omit<TreeViewProps, 'expandPaths' | 'expandLevel' | 'path'> & {
  depth: number;
  path: string;
};

export interface TreeNodeProps extends ConnectedTreeNodeProps {
  expanded: boolean;
  title?: string;
  shouldShowArrow?: boolean;
  shouldShowPlaceholder?: boolean;
  onClick?: () => void;
}

export interface NodeRendererProps extends TreeNodeProps {
  /** Comes from `dataIterator`, not sure best way to type this */
  isNonenumerable: boolean;
}

type NodeRendererType = FC<NodeRendererProps>;
