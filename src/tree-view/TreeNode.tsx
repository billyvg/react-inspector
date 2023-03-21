/* eslint-disable @typescript-eslint/no-empty-function */
import React, { Children, CSSProperties, FC, memo } from 'react';
import { useStyles } from '../styles';
import { TreeNodeProps } from '../types';

interface ArrowProps {
  styles: Record<string, CSSProperties>;
  expanded: boolean;
}

const Arrow: FC<ArrowProps> = ({ expanded, styles }) => (
  <span
    style={{
      ...styles.base,
      ...(expanded ? styles.expanded : styles.collapsed),
    }}>
    ▶
  </span>
);

const DefaultNodeRenderer: FC<TreeNodeProps> = memo(({ name }) => <span>{name}</span>);

export const TreeNode: FC<TreeNodeProps> = memo((props) => {
  const {
    children,
    title,
    expanded = true,
    onClick = () => {},
    nodeRenderer = DefaultNodeRenderer,
    shouldShowArrow = false,
    shouldShowPlaceholder = true,
  } = props;

  const styles = useStyles('TreeNode');
  const NodeRenderer = nodeRenderer;

  return (
    <li aria-expanded={expanded} role="treeitem" style={styles.treeNodeBase} title={title}>
      <div style={styles.treeNodePreviewContainer} onClick={onClick}>
        {shouldShowArrow || Children.count(children) > 0 ? (
          <Arrow expanded={expanded} styles={styles.treeNodeArrow} />
        ) : (
          shouldShowPlaceholder && <span style={styles.treeNodePlaceholder}>&nbsp;</span>
        )}
        <NodeRenderer {...props} />
      </div>

      <ol role="group" style={styles.treeNodeChildNodesContainer}>
        {expanded ? children : undefined}
      </ol>
    </li>
  );
});
