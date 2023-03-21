import React, { useContext, useCallback, useLayoutEffect, useState, memo, FC } from 'react';
import { ExpandedPathsContext } from './ExpandedPathsContext';
import { TreeNode } from './TreeNode';
import { DEFAULT_ROOT_PATH, hasChildNodes, getExpandedPaths } from './pathUtils';

import { useStyles } from '../styles';
import { ConnectedTreeNodeProps, Data, DataIterator, OnExpandCallback, TreeViewProps } from '../types';

const ConnectedTreeNode = memo<ConnectedTreeNodeProps>((props) => {
  const { data, dataIterator, path, depth, nodeRenderer, onExpand } = props;
  const [expandedPaths, setExpandedPaths] = useContext(ExpandedPathsContext);
  const nodeHasChildNodes = hasChildNodes(data, dataIterator);
  const expanded = !!expandedPaths[path];

  const handleClick = useCallback(
    () =>
      nodeHasChildNodes &&
      setExpandedPaths((prevExpandedPaths) => {
        const newExpandedPaths = {
          ...prevExpandedPaths,
          [path]: !expanded,
        };

        if (typeof onExpand === 'function') {
          onExpand(path, newExpandedPaths);
        }

        return newExpandedPaths;
      }),
    [nodeHasChildNodes, setExpandedPaths, path, expanded, onExpand]
  );

  return (
    <TreeNode
      expanded={expanded}
      // show arrow anyway even if not expanded and not rendering children
      shouldShowArrow={nodeHasChildNodes}
      // show placeholder only for non root nodes
      shouldShowPlaceholder={depth > 0}
      // Render a node from name and data (or possibly other props like isNonenumerable)
      nodeRenderer={nodeRenderer}
      {...props}
      // Do not allow override of `onClick`
      onClick={handleClick}>
      {
        // only render if the node is expanded
        expanded
          ? [...dataIterator(data)].map(({ name, data, ...rendererProps }) => {
              return (
                <ConnectedTreeNode
                  name={name}
                  data={data}
                  depth={depth + 1}
                  path={`${path}.${name}`}
                  key={name}
                  dataIterator={dataIterator}
                  nodeRenderer={nodeRenderer}
                  {...rendererProps}
                />
              );
            })
          : null
      }
    </TreeNode>
  );
});

export const TreeView = memo<TreeViewProps>(
  ({ name, data, dataIterator, nodeRenderer, expandPaths, expandLevel, onExpand }) => {
    const styles = useStyles('TreeView');
    const stateAndSetter = useState({});
    const [, setExpandedPaths] = stateAndSetter;

    useLayoutEffect(
      () =>
        setExpandedPaths((prevExpandedPaths) =>
          getExpandedPaths(data, dataIterator, expandPaths, expandLevel, prevExpandedPaths)
        ),
      [data, dataIterator, expandPaths, expandLevel]
    );

    return (
      <ExpandedPathsContext.Provider value={stateAndSetter}>
        <ol role="tree" style={styles.treeViewOutline}>
          <ConnectedTreeNode
            name={name}
            data={data}
            dataIterator={dataIterator}
            depth={0}
            path={DEFAULT_ROOT_PATH}
            nodeRenderer={nodeRenderer}
            onExpand={onExpand}
          />
        </ol>
      </ExpandedPathsContext.Provider>
    );
  }
);
