import stylesheet from '@react-pdf/stylesheet';

export const resolveStyles = (container) => {
  const containerStyle = { width: container.style.width, height: container.style.height, orientation: 'portrait' };
  resolveNodeStyles(containerStyle)(container);
}

const resolveNodeStyles = (containerStyle) => (node) => {
  const style = stylesheet(containerStyle, node.style);
  node.style = style;

  if (!node.children) return node;

  const children = node.children.map(resolveNodeStyles(containerStyle));
  node.children = children;

  return node;
}